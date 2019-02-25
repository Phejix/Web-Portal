from ..webpage import Webpage

import flask

#Insert a messages page later
message_centre_page = Webpage(template_link = None)

def check_message_updates():
    return flask.json.jsonify({
        "unread" : len(message_centre_page.MessageCentre.get_unread_messages()),
        "recentMessages" : message_centre_page.MessageCentre.get_datetime_ordered_messages(max_amount = 10)
    })

def update_read_messages():
    request = flask.request.get_json()
    
    if request:
        return flask.json.jsonify(message_centre_page.MessageCentre.read_messages(messages = request))

    return flask.json.jsonify("")

message_centre_page.create_rule(url = "/MessageCentre/check_message_updates", function = check_message_updates)
message_centre_page.create_rule(url = "/MessageCentre/update_read_messages", function = update_read_messages, methods = ["POST"])