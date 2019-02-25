import csv
import codecs

class FileReader(object):

    def __init__(self, file_path, chunk_size = None):
        self.chunk_size = chunk_size
        self.file_path = file_path
        self.restart_point = 0
        self.remaining = True

    def file_to_dict_list(self, encoding = "utf-8-sig", chunk = False):
        with codecs.open(self.file_path, encoding = encoding) as file:
            reader = csv.DictReader(file)

            if chunk and self.chunk_size:
                return self.get_chunk(reader)
            else:
                return list(reader)

    def get_headers(self, encoding = 'utf-8-sig'):
        with codecs.open(self.file_path, encoding = encoding) as file:
            return next(csv.reader(file))

    def convert_dict_list_common_key(self, dict_list, common_key):
        """
        Returns:
            A single dictionary with the main keys being the
            common key of the dict list.

        Parameters:
            dict_list: A dictionary list.
            common_key: A key within the dictionary list
            that is shared by all. Used to transform the list
            into a single dictionary.
        """
        dictionary = {}

        for item in dict_list:
            item_dict = {}
            
            for key in item:
                if key != common_key:
                    item_dict[key] = item[key]

            dictionary[item[common_key]] = item_dict

        return dictionary

    def dict_list_to_single(self, dict_list):
        """
        Returns:
            A single dictionary with each column of the read csv
            being given a list of the values underneath.

        Parameters:
            dict_list: A list of dictionaries (from
            read_taxonomy)
        """
        single_dict = {}

        for dictionary in dict_list:
            for item, value in dictionary.items():

                if value != '':
                    if item in single_dict:
                        single_dict[item].append(value)
                    else:
                        single_dict[item] = [value]

        return single_dict

    def get_chunk(self, reader):
        i = j = 0
        chunk_list = []
        self.remaining = False

        for row in reader:
            if i < self.restart_point:
                i += 1
                continue

            elif j < self.chunk_size:
                chunk_list.append(row)
                j += 1
                i += 1

            else:
                self.restart_point = i
                self.remaining = True
                break

        return chunk_list
