@extends('layouts.main')

@section('content')
<!-- ============================================================= Content Start ============================================================= -->
<span class="display-zero">{{ $Locale = LaravelLocalization::getCurrentLocale() }}</span>
<div id="content-wrapper">
  <div class="container-fluid pb-0">
   <div class="top-category section-padding mb-4">
    <div class="row">
     <div class="col-md-12">
      <div class="main-title">
       <h6>{{ __('main.Popular_leagues') }}</h6>
     </div>
   </div>
   <div class="col-md-12">
    <div class="owl-carousel owl-carousel-leagues">
      @foreach($Tournaments as $Tournament)
      <div class="video-card history-video item mr-1">
       <div class="video-card-image">
        <a class="play-icon" href="{{ url('Tournaments') }}/{{$Tournament->id}}"></a>
        <a href="{{ url('Tournaments') }}/{{$Tournament->id}}">
          <img src="{{ asset($Tournament->ImageUpload->filename) }}" alt="{{ $Tournament->meta_description }}" class="img-fluid">
        </a>
        <div class="time"><i class="fas fa-money-bill-alt"></i> {{ $Tournament->Prize }} {{ __('main.USD')}}</div>
      </div>
      <div class="video-card-body">
        <div class="video-title">
          <a href="{{ url('Tournaments') }}/{{$Tournament->id}}">{{ $Tournament->{'Title_'.$Locale} }}</a>
        </div>
        <div class="video-view">
         <i class="fas fa-gamepad"></i> {{ $Tournament->Platform }} &nbsp;<i class="fas fa-calendar"></i> {!! date('M j, Y', strtotime($Tournament->created_at)) !!} &nbsp;<i class="fas fa-users"></i> {{ $Tournament->Player }}
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
     <h6>{{ __('main.Upcoming_Tournaments')}}</h6>
   </div>
 </div>
 @foreach($Tournaments as $Tournament)
 <div class="col-xl-3 col-sm-6 mb-3">
  <div class="video-card history-video">
   <div class="video-card-image">
    <a class="video-close" href="{{ url('Tournaments') }}/{{ $Tournament->id }}"><i class="fas fa-fw fa-film"></i></a>
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
<div class="video-block section-padding">
  <div class="row">
   <div class="col-md-12">
    <div class="main-title">
     <h6>{{ __('main.Gaming_Teams')}}</h6>
   </div>
 </div>
 @foreach($Teams as $Team)
 <div class="col-xl-3 col-sm-6 mb-3">
   <div class="channels-card">
    <div class="channels-card-image">
     <a href="{{ url('Teams') }}/{{$Team->id}}">
      <img src="{{ asset($Team->ImageUpload->filename) }}" alt="{{ $Team->{'Title_'.$Locale} }}" class="img-fluid">
    </a>
  </div>
  <div class="channels-card-body">
   <div class="channels-title">
    <a href="{{ url('Teams') }}/{{$Team->id}}">{{ $Team->{'Title_'.$Locale} }}</a>
  </div>
  <div class="channels-view">
    {!! substr($Team->{'body_'.$Locale}, 0, 180) !!}.
  </div>
</div>
</div>
</div>
@endforeach
</div>
</div>
</div>
<div class="p-10"></div>
<!-- ============================================================= Content end   ============================================================= -->
@endsection