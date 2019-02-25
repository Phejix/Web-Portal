from .. import webpage

import flask

textify = webpage.Webpage(template_link = "Textify/textify.html")

def textify_page(connection_id = None):
    return flask.render_template(textify.template_link)

#---------------------------SETTING DEFAULT PAGE STATE---------------------#
textify.ServerState["state"]["Textify"] = {
    'TextAnalysis' : {
        'textData' : []
    },
    'Textify' : {}
}
#---------------------------PAGE URLS--------------------------------------#
textify.create_rule(url = "/Textify", function = textify_page)
textify.create_rule(url = "/Textify/connections/<connection_id>", function = textify_page)