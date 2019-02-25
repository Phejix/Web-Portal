import flask
import os

#----------RESEARCH USER COOKIES FOR STATE MANAGEMENT----------#

#--------Importing Webpages-----------#
from .Apps import welcome_page
from .Apps.SearchLens import search_lens
from .Apps.CapsuleViewer import capsules_page
from .Apps.Textify import textify_page
from .Apps.MessageCentre import message_centre_page
from .Apps.Surveysaur import surveysaur_page
from .Apps.DDCTemplating import ddc_template

#----Called by runserver.py to start the application----#
def run_application(debug = False):
    directory = os.getcwd()

    application = flask.Flask(__name__,
        static_folder = os.path.join(directory, "static"),
        template_folder = os.path.join(directory, "server", "templates"))

    application.secret_key = "temp_key" #RESEARCH PROPER IMPLEMENTATION BEFORE DEPLOYMENT
    application.config['SESSION_TYPE'] = 'filesystem'

    load_webpages(application = application)

    application.run(debug = debug)

def load_webpages(application):
    """
    Loads the imported Webpage objects from the given app pages
    and adds their url rules to the application, then deletes them for the
    page object as they are no longer needed

    Parameters:
        application: flask.Flask object to add the url rules to.
    """
    pages = [
    welcome_page.welcome,
    search_lens.search_lens,
    capsules_page.capsules_page,
    message_centre_page.message_centre_page,
    textify_page.textify,
    surveysaur_page.surveysaur,
    surveysaur_page.surveysaur_hosting_page,
    ddc_template.ddc_template_page
    ]

    for page in pages:
        page.add_url_rules(application = application)