import time

def make_connection_attempt(function, kwarg_dictionary, error_dict, max_attempts = 10):
    """
    Tries to return the result of the passed function. If it fails, sleeps for designated
    time and retries up to a max.

    Parameters:
        function - The function to attempt, usually passed via lambda : y(x) if it has arguments
        error_dict: Dictionary of the format {error_type : sleep_period}
        max_attempts: Int. Times to try before raising an error.
    """
    errors = tuple_error_keys(error_dict = error_dict)

    for i in range(max_attempts):
        try:
            return function(**kwarg_dictionary)
        except errors as e:
            time.sleep(error_dict[type(e)])

    raise ValueError("Too Many Attempts Made")

def tuple_error_keys(error_dict):
    errors = []
    for key in error_dict:
        errors.append(key)

    return tuple(errors)
