import os
import codecs

class Folder(object):
    """
    Class for manipulating a folder.

    Attributes:
        folder: String path leading to the folder.
    """

    def __init__(self, folder):
        self.folder = folder

    def get_books(self):
        return os.listdir(self.folder)

    def get_directory(self):
        return self.folder

    def get_size(self):
        size_sum = 0

        for file in self.get_books():
            size_sum += os.path.getsize(self.get_directory() + "\\" + file)

        return size_sum

    def check_size_limit(self, size_limit):
        if self.get_size() > size_limit:
            return True
        else:
            return False

    def merge(self, output_path, encoding = "utf-8-sig"):
        books = self.get_books()

        if ".csv" not in output_path:
            csv_book = output_path + ".csv"
        else:
            csv_book = output_path

        first_book = True
        output = codecs.open(csv_book, "w", encoding = encoding)

        for index, book in enumerate(books):
            if first_book:
                first_book = False
                for line in codecs.open(self.get_directory() + "\\" + book, encoding = encoding):
                    output.write(line)
            else:
                next_file = codecs.open(self.get_directory() + "\\" + book, encoding = encoding)
                next(next_file, None)
                for line in next_file:
                    output.write(line)

                next_file.close()

        output.close()

    def clear_folder(self):
        books = self.get_books()

        for book in books:
            os.remove(self.get_directory() + "\\" + book)

