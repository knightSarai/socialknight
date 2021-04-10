from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import ImageCreateForm
from .models import Image


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
    return render(request, 'images/image/detail.html',context)