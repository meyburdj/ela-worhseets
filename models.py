"""SQLAlchemy models for ELAWorksheets."""

from datetime import datetime
from flask_login import UserMixin

from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy

bcrypt = Bcrypt()
db = SQLAlchemy()

DEFAULT_IMAGE_URL = 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fwww.pursuit-of-happiness.org%2Fwp-content%2Fuploads%2F2010%2F11%2Fsocrates.jpg&imgrefurl=https%3A%2F%2Fwww.pursuit-of-happiness.org%2Fsocrates-on-happiness%2F&tbnid=yQJq4sWa58qAsM&vet=12ahUKEwiAponB7KH8AhUHo3IEHR-kDjkQMygTegUIARDzAQ..i&docid=VLd3aVpMARx5jM&w=963&h=627&q=socrates%20teaching&ved=2ahUKEwiAponB7KH8AhUHo3IEHR-kDjkQMygTegUIARDzAQ'

# TODO: DEFAULT_IMAGE_URL = 

class User(UserMixin, db.Model):
    """ Base user """

    __tablename__ = 'users'

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    username = db.Column(
        db.Text,
        nullable=False,
        unique=True
    )

    email = db.Column(
        db.Text,
        nullable=False,
        unique=True
    )

    image_url = db.Column(
        db.Text,
        default=DEFAULT_IMAGE_URL
    )

    bio = db.Column(
        db.Text
    )

    location = db.Column(
        db.Text
    )

    timestamp = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    password = db.Column(
        db.Text,
        nullable=False,
    )

    worksheets = db.relationship('Worksheet', backref="user")

    # followers = db.relationship(
    #     "User",
    #     secondary="follows",
    #     primaryjoin=(Follows.user_being_followed_id == id),
    #     secondaryjoin=(Follows.user_following_id == id),
    #     backref="following",
    # )

    liked_worksheets = db.relationship(
        'Worksheet',
        secondary='liked_worksheets',
        backref='likers'
    )

    def __repr__(self):
        return f"<User #{self.id}: {self.username}, {self.email}>"

    @classmethod
    def signup(cls, username, email, password, bio="", image_url=DEFAULT_IMAGE_URL):
        """Sign up user.

        Hashes password and adds user to system.
        """

        hashed_pwd = bcrypt.generate_password_hash(password).decode('UTF-8')

        user = User(
            username=username,
            email=email,
            bio=bio,
            password=hashed_pwd,
            image_url=image_url,
        )

        db.session.add(user)
        return user

    @classmethod
    def authenticate(cls, username, password):
        """Find user with `username` and `password`.

        This is a class method (call it on the class, not an individual user.)
        It searches for a user whose password hash matches this password
        and, if it finds such a user, returns that user object.

        If this can't find matching user (or if password is wrong), returns
        False.
        """

        user = cls.query.filter_by(username=username).first()

        if user:
            is_auth = bcrypt.check_password_hash(user.password, password)
            if is_auth:
                return user

        return False




class Worksheet(db.Model):
    """ A worksheet created by a User """

    __tablename__ = 'worksheets'

    id = db.Column(
        db.Integer,
        primary_key=True,
    )

    title = db.Column(
        db.Text,
        nullable=False
    )

    grade_level = db.Column(
        db.Text,
        nullable=False
    )

    worksheet_text = db.Column(
        db.Text,
        nullable=False,
    )

    question_count = db.Column(
        db.Integer,
        nullable=False,
    )

    timestamp = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow,
    )


    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete='CASCADE'),
        nullable=False,
    )

class Article(db.Model):
    """ Articles that have been accessed and parsed """

    __tablename__ = 'articles'

    id = db.Column(
        db.Integer,
        primary_key=True,
    )

    domain_name = db.Column(
        db.Text,
        nullable=False,
    )

    article_url = db.Column(
        db.Text,
        nullable=False,
    )

    article_text = db.Column(
        db.Text,
        nullable=False,
    )

    timestamp = db.Column(
        db.DateTime,
        nullable=False,
        default=datetime.utcnow,
    )


class Saved_Worksheet(db.Model):
    """ Relationship between User and Worksheet """

    __tablename__ = "saved_worksheets"

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete='CASCADE'),
        primary_key = True
    )
    worksheet_id = db.Column(
        db.Integer,
        db.ForeignKey('worksheets.id', ondelete = 'CASCADE'),
        primary_key = True
    )

    def __repr__(self):
        return f'<Saved user_id={self.user_id} worksheet_id={self.worksheet_id}>'



class Liked_Worksheet(db.Model):
    """ Relationship between User and Worksheet """

    __tablename__ = "liked_worksheets"

    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete='CASCADE'),
        primary_key = True
    )
    worksheet_id = db.Column(
        db.Integer,
        db.ForeignKey('worksheets.id', ondelete = 'CASCADE'),
        primary_key = True
    )

    def __repr__(self):
        return f'<Like user_id={self.user_id} worksheet_id={self.worksheet_id}>'



# TODO: make into a form of social media with followers and groups that act as something similar to subreddits.



# class Follows(db.Model):
#     """Connection of a follower <-> followed_user."""

#     __tablename__ = 'follows'

#     user_being_followed_id = db.Column(
#         db.Integer,
#         db.ForeignKey('users.id', ondelete="cascade"),
#         primary_key=True,
#     )

#     user_following_id = db.Column(
#         db.Integer,
#         db.ForeignKey('users.id', ondelete="cascade"),
#         primary_key=True,
#     )


def connect_db(app):
    """Connect this database to provided Flask app.

    You should call this in your Flask app.
    """

    app.app_context().push()
    db.app = app
    db.init_app(app)


