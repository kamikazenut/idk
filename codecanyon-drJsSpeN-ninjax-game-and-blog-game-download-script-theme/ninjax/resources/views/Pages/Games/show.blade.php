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
        <img class="img-fluid border-10" src="{{ asset($Game->ImageUpload->filename) }}" width="100%" alt="{{ $Game->meta_description }}">
      </div>
      <div class="single-video-title box mb-3">
        <h2><a>{{ $Game->{'Title_'.$Locale} }}</a></h2>
        <p class="mb-0"><i class="fas fa-calendar"></i> {!! date('M j, Y', strtotime($Game->created_at)) !!}</p> 
      </div>
      <div class="single-video-author box mb-3">
       <a href="{{ $Game->Downloud }}" class="btn btn-primary btn-lg btn-block border-none" data-uk-tooltip="title: link Downloud" target="blank">
        <i class="fas fa-download"></i> {{ __('main.Download')}}: {{ $Game->seo_title }}
      </a>
    </div>
    <div class="single-video-info-content box mb-3">
      <h6>{{ __('main.About')}} :</h6>
      <p>{!! $Game->{'body_'.$Locale} !!}</p>
      <h6>{{ __('main.Category')}} :</h6>
      <p>
        @if(isset($Game->Category->{'Title_'.$Locale}))
        {{ $Game->Category->{'Title_'.$Locale} }}
        @else
        @endif
      </p>
    </div>
  </div>
</div>
<div class="col-md-4">
  <div class="single-video-right">
   <div class="row">
    <div class="col-md-12">
    <div class="main-title">
      <h6>{!! __('main.Trend_Games') !!}</h6>
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
      {{ __('main.Size')}} : {{ $TrendGame->seo_title }} &nbsp;<i class="fas fa-calendar-alt"></i> {!! date('M j, Y', strtotime($TrendGame->created_at)) !!}
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
<!-- ======================== Content Start ==================== -->
@endsection