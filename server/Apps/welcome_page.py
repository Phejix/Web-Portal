from .webpage import Webpage
from . import smart_loader

import flask
import json
import os

#------------------TODO: ADD COMMENTS ABOUT THE BELOW REQUEST OBJECTS STATING WHAT FORMAT THEY SHOULD BE IN ---------------#

welcome = Webpage(template_link = "welcome_page.html")

def get_app_list():
    return flask.json.jsonify([
        {'image' : flask.url_for('static', filename="images/Apps/Textify.svg"), 'name' : 'Textify', 'url' : flask.url_for('textify_page')},
        {'image' : flask.url_for('static', filename="images/Apps/Capsule.svg"), 'name' : 'Capsule Viewer', 'url' : flask.url_for('capsule_page')},
        {'image' : flask.url_for('static', filename="images/Apps/SearchLens.svg"), 'name' : 'Search Lens', 'url' : flask.url_for('search_lens_page')},
        #{'image' : flask.url_for('static', filename="images/Apps/Surveysaur.png"), 'name' : "Surveysaur", 'url' : flask.url_for('surveysaur_page')},
        {'image' : flask.url_for('static', filename="images/Apps/DDC Templating.svg"), 'name' : 'DCO Templating', 'url' : flask.url_for('ddc_template')}
    ])


def welcome_page(connection_id = None):
    return flask.render_template(welcome.template_link)


"""
Loads and checks the file according to the app's requirements.
If not needed a second call to clear_pathway should be made to delete the file.
"""
def smart_file_load():
    file_check = json.loads(flask.request.form["file_check"])

    return flask.json.jsonify(smart_loader.check_file(
        file = flask.request.files['file'],
        allowed_extensions = file_check["allowed_extensions"],
        required_headers = file_check["required_headers"],
        save_folder = welcome.config["uploads"]
    ))


"""Clears out files that aren't needed/were rejected by an app"""
def clear_pathway():
    request = flask.request.get_json()
    status = ""

    try:
        folder = welcome.config[request['folder']]
    except KeyError:
        return flask.json.jsonify("Folder {} not found".format(request['folder']))

    try:
        os.remove(os.path.join(folder, request['filename']))
    except PermissionError:
        print("Permission Denied")
        status = "Permission Denied"

    return flask.json.jsonify({"status" : status})

"""
    First checks for any connections, if not uploads the state of the app

    Parameters:
        'app_name' : string of the app's name,
        'connection_id' : (optional) string of the connectionID found in the url
                        only used when a connection has been made
"""


def get_state(app_name, connection_id = None):
    state_dictionary = welcome.get_state(app_name = app_name)
    if connection_id:
        try:
            connection_data = welcome.get_connection(
                app_name = app_name,
                connection_id = connection_id
            )
            state_dictionary = {**state_dictionary, **connection_data}
        except ValueError:
            pass

    return flask.json.jsonify(state_dictionary)

"""
    Saves an app's state in the server state for later use
    Request contains {
        'appName' : string of the app's name,
        'data' : the data to be saved (must be JSON serializable)
    }
"""
def save_state():
    request = flask.request.get_json()
    return flask.json.jsonify(welcome.save_state(app_name = request['appName'], data = request['data']))


def download_file():
    """
    Should we just add a chron job which removes old files? (Like MessageCentre)
    Or make a second API call?
    """
    filename = flask.request.form["filename"]
    downloads = welcome.config['downloads']

    return (
        flask.send_from_directory(
            directory = downloads,
            filename = filename,
            as_attachment = True)
    )


#--------------------------------------PAGE URLS-------------------------------------------------------#
welcome.create_rule(url = "/", function = welcome_page)
welcome.create_rule(url="/connections/<connection_id>", function = welcome_page)
welcome.create_rule(url = "/get_app_list", function = get_app_list)
welcome.create_rule(url = "/smart_loader", function = smart_file_load, methods = ["POST"])
welcome.create_rule(url = "/clear_pathway", function = clear_pathway, methods = ["POST"])
welcome.create_rule(url = "/save_state", function = save_state, methods = ["POST"])
welcome.create_rule(url = "/get_state/<app_name>", function = get_state)
welcome.create_rule(url = "/get_state/<app_name>/connections/<connection_id>", function = get_state)
welcome.create_rule(url = "/download_file", function = download_file, methods = ["POST"])