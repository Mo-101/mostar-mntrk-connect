import typing


def is_generic(klass):
    """ Determine whether klass is a generic class """
    return hasattr(klass, '__origin__')


def is_dict(klass):
    """ Determine whether klass is a Dict """
    return is_generic(klass) and klass.__origin__ == dict


def is_list(klass):
    """ Determine whether klass is a List """
    return is_generic(klass) and klass.__origin__ == list


def is_optional(klass):
    """ Determine whether klass is Optional """
    return is_generic(klass) and klass.__origin__ == typing.Union
