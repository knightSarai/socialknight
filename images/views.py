import json

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_POST
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage

from .forms import ImageCreateForm
from .models import Image
from common.decorators import ajax_required


@login_required
def image_create(request):
    if request.method == 'POST':
        image_form = ImageCreateForm(data=request.POST)
        if image_form.is_valid():
            cd = image_form.cleaned_data
            new_image = image_form.save(commit=False)
            new_image.user = request.user
            new_image.save()
            messages.success(request, 'Image added successfully')
            return redirect(new_image.get_absolute_url())
    else:
        image_form = ImageCreateForm(data=request.GET)

    return render(
        request,
        'images/image/create.html',
        {
            'form': image_form,
            'section': 'images'
        }
    )


def image_detail(request, id, slug):
    image = get_object_or_404(Image, id=id, slug=slug)

    context = {
        'section': 'images',
        'image': image
    }
    return render(request, 'images/image/detail.html', context)


# @ajax_required
@login_required
@require_POST
def image_like(request):
    # print(request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest')
    json_data = json.loads(request.body)
    image_id = json_data.get('id')
    action = json_data.get('action')
    if image_id and action:
        try:
            image = Image.objects.get(id=image_id)
            if action == 'like':
                image.users_like.add(request.user)
            else:
                image.users_like.remove(request.user)
            return JsonResponse({'status': 'ok'})
        except Exception as e:
            pass

    return JsonResponse({'status': 'error'})


def image_list(request):
    print('ajax ', request.is_ajax)
    is_ajax = request.is_ajax()
    json_data = json.loads(request.body) if is_ajax else {}
    page = json_data.get('page') if is_ajax else request.GET.get('page')

    images = Image.objects.all()
    paginator = Paginator(images, 8)

    try:
        images = paginator.page(page)
    except PageNotAnInteger:
        images = paginator.page(1)
    except EmptyPage:
        if is_ajax:
            return HttpResponse('')
        images = paginator.page(paginator.num_pages)

    if is_ajax:
        return render(request,
                      'images/image/list_ajax.html',
                      {'section': 'images', 'images': images})

    return render(request,
                  'images/image/list.html',
                  {'section': 'images', 'images': images})
