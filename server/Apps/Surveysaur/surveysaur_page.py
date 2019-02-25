from .. import webpage

import flask

surveysaur = webpage.Webpage(template_link = "Surveysaur/surveysaur.html")

def surveysaur_page(connection_id = None):
    return flask.render_template(surveysaur.template_link)

#-------------------------ADDING WEBPAGE LINKS---------------------------#
surveysaur.create_rule(url = "/Surveysaur", function = surveysaur_page)
surveysaur.create_rule(url = "/Surveysaur/connections/<connection_id>", function = surveysaur_page)

#-------------------------CREATING SECONDARY PAGE FOR SURVEY HOSTING-----------------------#
surveysaur_hosting_page = webpage.Webpage(template_link = "Surveysaur/surveysaur_hosting.html")

def surveysaur_hosting(survey_id = None):
    return flask.render_template(surveysaur_hosting_page.template_link)

surveysaur_hosting_page.create_rule(url = "/Surveysaur/s/<survey_id>", function = surveysaur_hosting)