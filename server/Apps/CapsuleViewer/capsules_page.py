from ..webpage import Webpage

import flask

capsules_page = Webpage(template_link = "CapsuleViewer/capsules.html")

def capsule_page():
    return flask.render_template(capsules_page.template_link)

def get_capsules():
    return flask.json.jsonify(capsules_page.CapsuleManager.get_capsules())

capsules_page.create_rule(url = "/CapsuleViewer", function = capsule_page)
capsules_page.create_rule(url = "/CapsuleViewer/get_capsules", function = get_capsules)