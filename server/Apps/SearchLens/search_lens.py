from .. import webpage
from ..utility import utility, FileReader, output_write
from .modules import search_lens_interface

import flask
import os

search_lens = webpage.Webpage(template_link = 'SearchLens/search_lens.html')

default_adwords_settings = {
    'language' : {"ID" : '1000', "Name" : "English"},
    'location' : {"ID" : "2826", "Name" : "United Kingdom"},
    'networkSettings' : {
        'Google Search' : True,
        'Search Network' : False,
        'Content Network' : False,
        'Partner Search Network' : False
    }
}

def search_lens_page(connection_id = None):
    return flask.render_template(search_lens.template_link)

def upload_keywords():
    request = flask.request.get_json()
    pathway = os.path.join(search_lens.config['uploads'], request["fileUpload"]["filename"])
    upload_list = FileReader.FileReader(file_path = pathway).file_to_dict_list()

    if request["fileUpload"]["uploadSelection"] == "append":
        if "keywordData" in request:
            upload_list = request["keywordData"] + upload_list

    if request["fileUpload"]["clearDuplicates"]:
        upload_list = utility.uniquify_dict_list(dict_list = upload_list)

    os.remove(pathway)

    return flask.json.jsonify({"keywordData" : upload_list})

"""
Uploads adwords call to Dockmaster using CapsuleManager
In request : {capsuleName : '', searchSelection: 'statistics', 'keywordData': [{'Keywords' : 'new'}], "settings" : {}}
"""
def call_adwords():
    request = flask.request.get_json()

    keyword_list = []

    for row in request["keywordData"]:
        keyword_list.append(row["Keywords"])

    network_settings = transform_network_settings(network_settings = request["settings"]["networkSettings"])
    
    response = search_lens.post_to_dockmaster(
        capsule_dictionary = {
            "capsule_name" : request["capsuleName"]
        },
        job_dictionary = {
            "origin" : "Search Lens",
            "function" : search_lens_interface.get_adwords_results,
            "kwarg_dictionary" : {
                "keyword_list" : keyword_list,
                'call_type' : request['searchSelection'],
                'location_id' : request['settings']['location']['ID'],
                'language_id' : request['settings']['language']['ID'],
                'network' : network_settings
            },
            "method_name" : "Adwords Keyword Suggestions"
        },
        message_dictionary = {
            'message' : '{} has completed running Search Lens'.format(request["capsuleName"]),
            'url_link' : "/CapsuleViewer"
        }
    )

    return flask.json.jsonify(response)

def transform_network_settings(network_settings):
    transformed_settings = {}

    for key in network_settings:
        transformed_key = "target{}".format(key.replace(" ", ""))
        transformed_settings[transformed_key] = network_settings[key]

    return transformed_settings

def convert_keywords_to_textify():
    request = flask.request.get_json()

    textData = []
    for row in request["keywordData"]:
        textData.append(row["Keywords"])

    connection_url = search_lens.build_connection(
        destination_app = "Textify",
        data = {
            "TextAnalysis" : {
                "textData" : textData
            }
        })

    return flask.json.jsonify({"status" : "success", "connection_url" : connection_url})


def download_keyword_data():
    request = flask.request.get_json()

    #request comes back as a dictionary list of keyword data
    #e.g. [{col1 : data, col2 : data, etc.}, ...,]

    #output_write.write_dictionary_list(dictionary_list = request, file_path = "results.csv")
    
    return flask.jsonify({})

#----------------------------------------SETTING DEFAULT PAGE STATE---------------------------------------------#
search_lens.ServerState["state"]["SearchLens"] = {
    "keywordData" : [],
    "settings" : default_adwords_settings
}
search_lens.ServerState["static"]["SearchLens"] = {
    "settingsOptions" : {
        'language' : search_lens_interface.get_languages(),
        'location' : search_lens_interface.get_locations(),
        'networkSettings' : {
            'Google Search' : True,
            'Search Network' : False,
            'Content Network' : False,
            'Partner Search Network' : False
        }
    }
}

#----------------------------------------PAGE URLS---------------------------------------------------------#
search_lens.create_rule(url = "/SearchLens", function = search_lens_page)
search_lens.create_rule(url = "/SearchLens/connections/<connection_id>", function = search_lens_page)
search_lens.create_rule(url = "/SearchLens/upload_keywords", function = upload_keywords, methods = ["POST"])
search_lens.create_rule(url = "/SearchLens/call_adwords", function = call_adwords, methods = ["POST"])
search_lens.create_rule(url = "/SearchLens/convert_keywords_to_textify", function = convert_keywords_to_textify, methods = ["POST"])
search_lens.create_rule(url = "/SearchLens/download_keyword_data", function = download_keyword_data, methods = ["POST"])