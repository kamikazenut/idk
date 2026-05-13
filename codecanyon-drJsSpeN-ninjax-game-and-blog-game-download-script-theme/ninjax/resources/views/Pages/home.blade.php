@extends('layouts.main')

@section('content')
<!--********************* SITE CONTENT *********************-->
<!--********************************************************-->
<span class="display-zero">{{ $Locale = LaravelLocalization::getCurrentLocale() }}</span>
<div id="content-wrapper">
  <div class="container-fluid pb-0">
   <div class="top-mobile-search">
    <div class="row">
     <div class="col-md-12">   
      <form class="mobile-search" method="GET" action="{!! url('search') !!}" enctype="multipart/form-data" role="search">
       {{ csrf_field() }}
       <div class="input-group">
         <input type="search" placeholder="{{ __('main.Search')}}" autofocus name="search" class="form-control">
         <div class="input-group-append">
           <button type="submit" class="btn btn-dark"><i class="fas fa-search"></i></button>
         </div>
       </div>
     </form>   
   </div>
 </div>
</div>
<!-- ================================== Start Search =================================== -->
<div class="owl-carousel owl-carousel-home">
 @foreach($slideGames as $slideGame)
 <div class="single-channel-image mb-4 img-380 item">
    @if(isset($slideGame->ImageUpload->filename))
    <img src="{{ asset($slideGame->ImageUpload->filename) }}" alt="{{ $slideGame->meta_description }}" class="img-fluid">
    @else
    @endif
   <div class="channel-profile">
    <div class="video-page text-danger">
      @if(isset($slideGame->Category->{'Title_'.$Locale}))
      {{ $slideGame->Category->{'Title_'.$Locale} }} <a href="{!! url('Cat') !!}/{!! $slideGame->Category->slug !!}"></a>
      @else
      @endif
    </div>
    <h1 class="slide-title">{{ $slideGame->{'Title_'.$Locale} }}</h1>
    <p class="bold">{!! substr($slideGame->{'body_'.$Locale}, 0, 80) !!}</p>
    <a class="btn btn-primary btn-sm" href="{{ url('Games') }}/{{$slideGame->slug}}">{{ __('main.Download_Game')}}</a>
    <div class="social hidden-xs">
     <a class="fb" href="{{ url('Games') }}/{{$slideGame->slug}}">{{ __('main.Size')}} : {{ $slideGame->seo_title }}</a>
   </div>
 </div>
</div>
@endforeach
</div>
<div class="top-category section-padding mb-4">
  <div class="row">
   <div class="col-md-12">
    <div class="main-title">
     <div class="btn-group float-right right-action">
      <a class="btn btn-primary" href="{{ url('Games') }}">{{ __('main.Trend_Games')}}</a>
    </div>
    <h6>{{ __('main.Trend_Games')}}</h6>
  </div>
</div>
<div class="col-md-12">
  <div class="owl-carousel owl-carousel-category">
    @foreach($Games as $Game)
    <div class="video-card item mr-1">
     <div class="video-card-image">
      <a class="play-icon" href="{{ url('Games') }}/{{$Game->slug}}"></a>
      <a href="{{ url('Games') }}/{{$Game->slug}}">
       <img src="{{ asset($Game->ImageUpload->filename) }}" alt="{{ $Game->meta_description }}" class="img-fluid">
     </a>
     @if(isset($Game->Category->{'Title_'.$Locale}))
     <div class="time">{{ $Game->Category->{'Title_'.$Locale} }} </div>
     @else
     @endif
   </div>
   <div class="video-card-body">
    <div class="video-title">
     <a href="{{ url('Games') }}/{{$Game->slug}}">{{ $Game->{'Title_'.$Locale} }}</a>
   </div>
   <div class="video-page text-danger">
     @if(isset($Game->Category->{'Title_'.$Locale}))
     {{ $Game->Category->{'Title_'.$Locale} }}
     @else
     @endif
   </div>
   <div class="video-view">
     {{ __('main.Size')}} : {{ $Game->seo_title }} &nbsp;<i class="fas fa-calendar-alt"></i> {!! date('M j, Y', strtotime($Game->created_at)) !!}
   </div>
 </div>
</div>
@endforeach
</div>
</div>
</div>
</div>
<hr>
<div class="video-block section-padding">
  <div class="row">
   <div class="col-md-12">
    <div class="main-title">
     <div class="btn-group float-right right-action">
       <a class="btn btn-primary" href="{!! url('Games') !!}">{{ __('main.Featured_Games')}}</a>
     </div>
     <h6>{!! __('main.Featured_Games') !!}</h6>
   </div>
 </div>
 @foreach($BigGames as $BigGame) 
 <div class="col-xl-3 col-sm-6 mb-3">
  <div class="video-card">
   <div class="video-card-image">
    <a class="play-icon" href="{{ url('Games') }}/{{$BigGame->slug}}"></a>
    <a href="{{ url('Games') }}/{{$BigGame->slug}}">
     <img src="{{ asset($BigGame->ImageUpload->filename) }}" alt="{{ $BigGame->meta_description }}" class="img-fluid">
   </a>
   @if(isset($BigGame->Category->{'Title_'.$Locale}))
   <div class="time">{{ $BigGame->Category->{'Title_'.$Locale} }} </div>
   @else
   @endif
 </div>
 <div class="video-card-body">
  <div class="video-title">
   <a href="{{ url('Games') }}/{{$BigGame->slug}}">{{ $BigGame->{'Title_'.$Locale} }}</a>
   <p>{!! substr($BigGame->{'body_'.$Locale}, 0, 180) !!}.</p>
 </div>
 <div class="video-page text-danger">
  @if(isset($BigGame->Category->{'Title_'.$Locale}))
  {{ $BigGame->Category->{'Title_'.$Locale} }}
  @else
  @endif
</div>
<div class="video-view">
  {{ __('main.Size')}} : {{ $BigGame->seo_title }} &nbsp;<i class="fas fa-calendar-alt"></i> {!! date('M j, Y', strtotime($BigGame->created_at)) !!}
</div>
</div>
</div>
</div>
@endforeach
</div>
</div>
<hr class="mt-0">
<div class="video-block section-padding">
  <div class="row">
   <div class="col-md-12">
    <div class="main-title">
     <div class="btn-group float-right right-action">
       <a class="btn btn-primary" href="{{ url('Tournaments') }}">{{ __('main.Tournaments')}}</a>
     </div>
     <h6>{{ __('main.Upcoming_Tournaments')}}</h6>
   </div>
 </div>
 @foreach($Tournaments as $Tournament)
 <div class="col-xl-3 col-sm-6 mb-3">
  <div class="video-card history-video">
   <div class="video-card-image">
    <a class="video-close" href="{{ url('Tournaments') }}/{{ $Tournament->id }}"><i class="fas fa-bolt"></i></a>
    <a class="play-icon" href="{{ url('Tournaments') }}/{{ $Tournament->id }}"></a>
    <a href="{{ url('Games') }}/{{$Tournament->slug}}">
     <img src="{{ asset($Tournament->ImageUpload->filename) }}" alt="{{ $Tournament->meta_description }}" class="img-fluid">
   </a>
   <div class="time"><i class="fas fa-money-bill-alt"></i> {{ $Tournament->Prize }} {{ __('main.USD')}}</div>
 </div>
 <div class="video-card-body">
  <div class="video-title">
   <a href="{{ url('Tournaments') }}/{{ $Tournament->id }}">{{ $Tournament->{'Title_'.$Locale} }}</a>
 </div>
 <div class="video-view">
  <i class="fas fa-gamepad"></i> {{ $Tournament->Platform }} &nbsp;<i class="fas fa-calendar"></i> {!! date('M j, Y', strtotime($Tournament->created_at)) !!} &nbsp;<i class="fas fa-users"></i> {{ $Tournament->Player }}
</div>
</div>
</div>
</div>
@endforeach
</div>
</div>
</div>
<div class="p-10"></div>
@endsection
