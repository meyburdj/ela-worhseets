from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField, HiddenField
from wtforms.validators import DataRequired, Email, Length, EqualTo



class UserSignupForm(FlaskForm):
    username = StringField('Username', validators =[DataRequired()])
    email = StringField('Email', validators=[DataRequired(),Email()])
    password = PasswordField('Password', validators = [DataRequired(), Length(min=6)])
    password2 = PasswordField('Confirm Password', validators = [DataRequired(),EqualTo('password')])
    bio = StringField('(Optional) Bio')
    image_url = StringField('(Optional) Image URL')

class LoginForm(FlaskForm):
    """Login form."""

    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[Length(min=6)])

def is_safe_url(target):
    ref_url = urlparse(request.host_url)
    test_url = urlparse(urljoin(request.host_url, target))
    return test_url.scheme in ('http', 'https') and \
           ref_url.netloc == test_url.netloc


def get_redirect_target():
    for target in request.args.get('next'), request.referrer:
        if not target:
            continue
        if is_safe_url(target):
            return target

class CSRFProtectForm(FlaskForm):
    """Form just for CSRF Protection"""
# class RedirectForm(Form):
#     next = HiddenField()

#     def __init__(self, *args, **kwargs):
#         Form.__init__(self, *args, **kwargs)
#         if not self.next.data:
#             self.next.data = get_redirect_target() or ''

#     def redirect(self, endpoint='index', **values):
#         if is_safe_url(self.next.data):
#             return redirect(self.next.data)
#         target = get_redirect_target()
#         return redirect(target or url_for(endpoint, **values))