import os
from dotenv import load_dotenv

from flask import Flask, render_template, request, flash, redirect, session, g, jsonify
from flask_login import LoginManager, login_user, UserMixin, logout_user, login_required
# from flask_debugtoolbar import DebugToolbarExtension
from sqlalchemy.exc import IntegrityError

from forms import UserSignupForm, LoginForm, CSRFProtectForm
from models import db, connect_db, User
from scrape import host_names, grantland_scrape, politico_scrape

app = Flask(__name__)

load_dotenv()

login_manager = LoginManager()

login_manager.init_app(app)

CURR_USER_KEY = "curr_user"



# Get DB_URI from environ variable (useful for production/testing) or,
# if not set there, use development local db.
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = (
    os.environ['DATABASE_URL'].replace("postgres://", "postgresql://"))
app.config['SQLALCHEMY_ECHO'] = False
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = True
app.config['SECRET_KEY'] = os.environ['SECRET_KEY']
# toolbar = DebugToolbarExtension(app)

connect_db(app)
db.create_all()

@app.before_request
def add_csrf_form_to_all_pages():
    """Before every route, add CSRF-only form to global object."""

    g.csrf_form = CSRFProtectForm()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

@app.get("/")
def home():

    return render_template('index.html')

@app.get("/test")
def test():

    return render_template('test.html')


@app.route('/signup', methods = ['POST','GET'])
def signup():
    form = UserSignupForm()

    if form.validate_on_submit():
        try:
            user = User.signup(
                username=form.username.data,
                password=form.password.data,
                email=form.email.data,
                bio=form.bio.data or "",
                image_url=form.image_url.data or User.image_url.default.arg,
            )
            db.session.commit()

        except IntegrityError:
            flash("Username already taken", 'danger')
            return render_template('user-signup.html', form=form)

        login_user(user)

        flask.flash('Logged in successfully.')

        return redirect("/")

    else:
        return render_template('user-signup.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():

    form = LoginForm()

    if form.validate_on_submit():
        user = User.query.filter_by(username = form.username.data).first()
        if user is not None and user.authenticate(form.username.data, form.password.data):
            login_user(user)
            return redirect("/")
        flash('Invalid email address or Password.')    
    return render_template('user-login.html', form=form)

@app.post("/logout")
@login_required
def logout():
    logout_user()
    return redirect("/")


#############################################################################
# api calls

@app.post("/api/get-article-text")
def get_text():
    """ takes a request of a url and return text """

    url = request.json["url"]
    host_name = request.json["hostName"]
    scrape_function = host_names[host_name]
    article_text = scrape_function(url)

    return jsonify(article_text)

    