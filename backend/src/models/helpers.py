def get_with_default(dictionary, key, default):
    value = dictionary.get(key, default)
    if value is None or value == "":
        return default
    else:
        return value
