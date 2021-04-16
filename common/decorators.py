from functools import wraps

from django.http import HttpResponseBadRequest, HttpRequest


def require_media_type():
    def decorator(func):
        @wraps(func)
        def inner(request, *args, **kwargs):
            if not request.headers.get('x-requested-with') == 'XMLHttpRequest':
                response = HttpResponseBadRequest('Request require to be Ajax')
                return response
            return func(request, *args, **kwargs)

        return inner

    return decorator


require_ajax = require_media_type()
