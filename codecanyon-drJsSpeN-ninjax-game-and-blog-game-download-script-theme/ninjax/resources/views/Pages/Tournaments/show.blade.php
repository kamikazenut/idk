@extends('layouts.main')

@section('content')
<!-- ============================================================= Content Start ============================================================= -->
<span class="display-zero">{{ $Locale = LaravelLocalization::getCurrentLocale() }}</span>
<div id="content-wrapper">
  <div class="container-fluid pb-0">
   <div class="video-block section-padding">
    <div class="row">
     <div class="col-md-8">
      <div class="single-video-left">
       <div class="single-video">
        <img class="img-fluid border-10" src="{{ asset($Tournament->ImageUpload->filename) }}" width="100%">
      </div>
      <div class="single-video-title box mb-3">
        <h2><a>{{ $Tournament->{'Title_'.$Locale} }}</a></h2>
        <p class="mb-0"><i class="fas fa-calendar"></i> {!! date('M j, Y', strtotime($Tournament->created_at)) !!}</p> 
      </div>
      <div class="single-video-info-content box mb-3">
        <h6>{{ __('main.About')}} :</h6>
        <p><i class="fas fa-chess-knight"></i> {!! $Tournament->{'body_'.$Locale} !!} <br>
         <i class="fas fa-users"></i> {{ __('main.Platform')}} : {{ $Tournament->Platform }}<br>
         <i class="fas fa-money-bill-alt"></i> {{ $Tournament->Prize }} {{ __('main.USD')}} <br>
         <i class="fas fa-users"></i> {{ $Tournament->Player }}
       </p>
     </div>
   </div>
 </div>
 <div class="col-md-4">
  <div class="single-video-right">
   <div class="row">
    <div class="col-md-12">
    <div class="main-title">
      <h6>{{ __('main.Trend_Games')}}</h6>
    </div>
  </div>
  <div class="col-md-12">
   @foreach($TrendGames as $TrendGame)
   <div class="video-card video-card-list">
    <div class="video-card-image">
     <a class="play-icon" href="{{ url('Games') }}/{{$TrendGame->slug}}"></a>
     <a href="{{ url('Games') }}/{{$TrendGame->slug}}">
       <img src="{{ asset($TrendGame->ImageUpload->filename) }}" alt="{{ $TrendGame->meta_description }}" class="img-fluid">
     </a>
     <div class="time">{{ __('main.Trend_Games')}}</div>
   </div>
   <div class="video-card-body">
     <div class="video-title">
      <a href="{{ url('Games') }}/{{$TrendGame->slug}}">{{ $TrendGame->{'Title_'.$Locale} }}</a>
    </div>
    <div class="video-page text-danger">
      @if(isset($TrendGame->Category->{'Title_'.$Locale}))
      {{ $TrendGame->Category->{'Title_'.$Locale} }}
      @else
      @endif 
    </div>
    <div class="video-view">
      {{ __('main.Size')}} : {{ $TrendGame->seo_title }} &nbsp;<i class="fas fa-calendar-alt"></i> 
      {!! date('M j, Y', strtotime($TrendGame->created_at)) !!}
    </div>
  </div>
</div>
@endforeach
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<div class="p-10"></div>
<!-- ========= Content End  ============= -->
@endsection