import json
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST

from common.decorators import require_ajax
from .forms import UserRegistrationForm, UserEditForm, ProfileEditForm
from django.contrib import messages
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

from .models import Contact


@login_required
def dashboard(request):
    return render(request, 'account/dashboard.html', {'section': 'dashboard'})


def register(request):
    if request.method == 'POST':
        user_form = UserRegistrationForm(request.POST)
        if user_form.is_valid():
            new_user = user_form.save(commit=False)
            new_user.set_password(user_form.cleaned_data['password'])
            new_user.save()
            return render(request,
                          'account/register_done.html',
                          {'new_user': new_user}
                          )
    else:
        user_form = UserRegistrationForm()
    return render(request,
                  'account/register.html',
                  {'user_form': user_form}
                  )


@login_required
def edit(request):
    if request.method == 'POST':
        user_form = UserEditForm(instance=request.user, data=request.POST)
        profile_form = ProfileEditForm(
            instance=request.user.profile,
            data=request.POST,
            files=request.FILES
        )

        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile_form.save()
            messages.success(request, 'Profile updated successfully')
        else:
            messages.error(request, 'Error updating your profile')
    else:
        user_form = UserEditForm(instance=request.user)
        profile_form = ProfileEditForm(instance=request.user.profile)

    return render(
        request,
        'account/edit.html',
        {
            'user_form': user_form,
            'profile_form': profile_form,
        }
    )


@login_required
def user_list(request):
    users = User.objects.filter(is_active=True)
    return render(
        request,
        'account/user/list.html',
        {
            'section': 'people',
            'users': users
        }
    )


@login_required
def user_detail(request, username):
    user = get_object_or_404(
        User,
        username=username,
        is_active=True
    )
    return render(
        request,
        'account/user/detail.html',
        {
            'section': 'people',
            'user': user
        }
    )


@login_required
@require_POST
@require_ajax
def user_follow(request):
    json_data = json.loads(request.body)
    user_id = json_data.get('id')
    action = json_data.get('action')
    if user_id and action:
        try:
            user = User.objects.get(id=user_id)
            if action == 'follow':
                Contact.objects.get_or_create(user_from=request.user, user_to=user)
            else:
                Contact.objects.filter(
                    user_from=request.user,
                    user_to=user
                ).delete()
            return JsonResponse({'status': 'ok'})
        except User.DoesNotExist as e:
            return JsonResponse({'status': 'error', 'error': [f'{e}']})

    return JsonResponse({'status': 'error'})
