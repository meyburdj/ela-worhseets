import os
from dotenv import load_dotenv

from flask import Flask, render_template, request, flash, redirect, session, g
from flask_login import LoginManager
from flask_debugtoolbar import DebugToolbarExtension
from sqlalchemy.exc import IntegrityError

from forms import UserSignupForm, LoginForm
from models import db, connect_db, User

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
toolbar = DebugToolbarExtension(app)

connect_db(app)
db.create_all()

@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

@app.get("/")
def home():

    return render_template('index.html')

@app.route('/signup', methods = ['POST','GET'])
def signup():
    form = UserSignupForm()

    if form.validate_on_submit():
        try:
            user = User.signup(
                username=form.username.data,
                password=form.password.data,
                email=form.email.data,
                bio=form.bio.data,
                image_url=form.image_url.data or User.image_url.default.arg,
            )
            db.session.commit()

        except IntegrityError:
            flash("Username already taken", 'danger')
            return render_template('users/signup.html', form=form)

        login_user(user)

        flask.flash('Logged in successfully.')

        return redirect("/")

    else:
        return render_template('users/signup.html', form=form)


#############################################################################
# api calls

@app.post("/api/get_text")
def get_text():
    """ takes a request of a url and return text """
    