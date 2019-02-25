from .. import webpage

import flask
import bs4

import os

import time

ddc_template_page = webpage.Webpage(template_link = "DDC Templating/ddc_templating.html")

html_template = """
  <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <script src="https://s0.2mdn.net/ads/studio/Enabler.js"></script>
        <script type="text/javascript" src="ua-parser.min.js"></script>
        <link rel="stylesheet" type="text/css" href="style.css">
        <title>Index</title>
        {head}
      </head>
      <body>
        {body}
      </body>
    </html>
"""

html_storage = {
    "head" : [],
    "body" : []
}

def ddc_template():
    return flask.render_template(ddc_template_page.template_link)

"""
Currently the App is simply a Download so storage is irrelevant. It is still used so that it becomes
easy to separate in future editions.
"""
def get_html():
    request = flask.request.get_json()

    #request comes in as {'segment' : {html : '', operation : ''}}
    for segment, values in request['data'].items():
        store_html(
            segment = segment,
            html = clean_react_code(html_string = values['html']),
            operation = values['operation']
        )

    soup = bs4.BeautifulSoup(refine_html(), "html.parser")

    save_html_file(filename = request["filename"], html = soup.prettify())

    """
    return (
        flask.send_from_directory(
            directory = ddc_template_page.config['downloads'],
            filename = request["filename"],
            as_attachment = True)
    )
    """
    return flask.json.jsonify({ "filename" : request['filename']})

def refine_html():
    defaults = {"head" : [''], "body" : ['']}

    for segment in html_storage:
        if segment in defaults:
            defaults[segment] = html_storage[segment]

    for string_list in defaults:
        defaults[string_list] = ''.join(defaults[string_list])

    return html_template.format(**defaults)

def store_html(segment, html, operation):
    if operation == "append":
        html_storage[segment].append(html)

    elif operation == "overwrite":
        html_storage[segment] = [html] #html is stored in lists so that other objects can be appended if necessary

def clean_react_code(html_string):
    html_string = html_string.replace('<div data-reactroot="">', '') #Removes the opening tag of the react data root
    html_string = html_string.rsplit('</div>', 1)[0] #Removes the last div tag which belongs to the react data tag
    return html_string

def save_html_file(filename, html):
    file_path = os.path.join(ddc_template_page.config['downloads'], filename)

    with open(file_path, 'w') as html_file:
        html_file.write(html)

    return ""

ddc_template_page.create_rule(url = "/ddc_templating", function = ddc_template)
ddc_template_page.create_rule(url = "/ddc_templating/get_html", function = get_html, methods = ["POST"])