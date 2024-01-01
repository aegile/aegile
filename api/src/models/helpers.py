def get_with_default(dictionary, key, default):
    value = dictionary.get(key, default)
    if not value:
        return default
    return value
