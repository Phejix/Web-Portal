from .utility.FileReader import FileReader
from werkzeug.utils import secure_filename

from datetime import datetime
import os

def check_file(file, allowed_extensions, required_headers, save_folder, encoding = "utf-8-sig"):
    if not check_extensions(filename = file.filename, allowed_extensions = allowed_extensions):
        return {'responseType' : 'error', 'data' : {'errorMessage' : 'File Type not allowed'}}

    filename = "{} {}".format(datetime.strftime(datetime.now(), "%Y%m%d%H%M%S"), secure_filename(file.filename))
    pathway = os.path.join(save_folder, filename)
    file.save(pathway)

    headers = FileReader(file_path = pathway).get_headers()

    if not check_headers(headers = headers, required_headers = required_headers):
        os.remove(pathway)
        return {'responseType' : 'error', 'data' : {'errorMessage' : "Required Headers Not Found '{}'".format(", ".join(required_headers)), 'folder' : save_folder, 'filename' : filename}}

    return {'responseType' : 'ok', 'data' : {'filename' : filename, 'folder' : save_folder}}

def check_extensions(filename, allowed_extensions):
    if '.' in filename:
        extension = filename.rsplit('.', 1)[1].lower()
    else:
        return False

    if extension in allowed_extensions:
        return True
    else:
        return False

def check_headers(headers, required_headers):
    for required_header in required_headers:
        for header in headers:
            if required_header == header:
                return True

    return False