@extends('Dashboard.main')

@section('Dashboard')
<!-- START PAGE CONTENT -->
<div class="content ">
  <!-- START PAGE COVER -->
  <div class="jumbotron page-cover" data-pages="parallax">
    <div class=" container-fluid  container-fixed-lg">
      <div class="inner">
        <!-- START BREADCRUMB -->
        <ol class="breadcrumb">  
          <li class="breadcrumb-item"><a href="{{ url('admin') }}">Dashboard</a></li>
          <li class="breadcrumb-item"><a href="{{ route('Galleries.index') }}">Tournament</a></li>
          <li class="breadcrumb-item active">Create Tournament</li>
        </ol>
        <!-- END BREADCRUMB -->
        <div class="container-md-height">
          <div class="row">
            <!-- START card -->
            <div class="card card-transparent">
              <div class="card-body">
                <h3><i class="pg-ui"></i> add Tournament</h3>
              </div>
            </div>
            <!-- END card -->
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- END PAGE COVER -->
  <!-- START CONTAINER FLUID -->
  <div class=" container-fluid container-fixed-lg">
    <!-- START card -->
    <div class="row">
      <div class="col-lg-6">
        <!-- START card -->
        <div class="card card-default">
          <div class="card-header ">
            <div class="card-title">
              Create your Tournament
            </div>
          </div>
          @if ($errors->any())    
          <div class="pgn-wrapper top-inline" data-position="top">
            <div class="pgn push-on-sidebar-open pgn-bar">
              <div class="alert alert-danger">
                <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
                @foreach ($errors->all() as $error)
                {{ $error }}
                @endforeach
              </div>
            </div>
          </div>
          @endif
          <div class="card-body">
          <form action="{{ route('Galleries.store') }}" method="POST"  role="form" enctype="multipart/form-data"> 
              @csrf
            <div class="form-group form-group-default required">
              <label for="Title_en">Tournament Title</label>
              <input type="text" class="form-control @error('Title_en') is-invalid @enderror" required="" placeholder="ex: Tournament English" id="Title_en" name="Title_en">
              @error('Title_en')
                <div class="alert alert-danger">{{ $message }}</div>
              @enderror 
            </div>
            <div class="form-group form-group-default required">
              <label for="Title_ar">Tournament Title</label>
              <input type="text" class="form-control @error('Title_ar') is-invalid @enderror" required="" placeholder="ex: Tournament arabic" id="Title_ar" name="Title_ar">
              @error('Title_ar')
                <div class="alert alert-danger">{{ $message }}</div>
              @enderror 
            </div>
            <div class="form-group form-group-default required">
              <label for="Title_fr">Tournament Title</label>
              <input type="text" class="form-control @error('Title_fr') is-invalid @enderror" required="" placeholder="ex: Tournament france" id="Title_fr" name="Title_fr">
              @error('Title_fr')
                <div class="alert alert-danger">{{ $message }}</div>
              @enderror 
            </div>
            <div class="form-group form-group-default required">
              <label for="body_en">Tournament Content English</label>
              <input type="text" class="form-control @error('body_en') is-invalid @enderror" required="" placeholder="ex:Content English" id="body_en" name="body_en">
              @error('body_en')
                <div class="alert alert-danger">{{ $message }}</div>
              @enderror 
            </div>
            <div class="form-group form-group-default required">
              <label for="body_ar">Tournament Content Arabic</label>
              <input type="text" class="form-control @error('body_ar') is-invalid @enderror" required="" placeholder="ex:Content arabic" id="body_ar" name="body_ar">
              @error('body_ar')
                <div class="alert alert-danger">{{ $message }}</div>
              @enderror 
            </div>
            <div class="form-group form-group-default required">
              <label for="body_fr">Tournament Content France</label>
              <input type="text" class="form-control @error('body_fr') is-invalid @enderror" required="" placeholder="ex:Content france" id="body_fr" name="body_fr">
              @error('body_fr')
                <div class="alert alert-danger">{{ $message }}</div>
              @enderror 
            </div>
             <div class="form-group form-group-default required">
              <label for="body_fr">Tournament Prize</label>
              <input type="text" class="form-control @error('Prize') is-invalid @enderror" required="" placeholder="ex:Content Prize" id="Prize" name="Prize">
              @error('Prize')
                <div class="alert alert-danger">{{ $message }}</div>
              @enderror 
            </div>
            <div class="form-group form-group-default required">
              <label for="body_fr">Tournament Platform</label>
              <input type="text" class="form-control @error('Platform') is-invalid @enderror" required="" placeholder="ex:Content Platform" id="Platform" name="Platform">
              @error('Platform')
                <div class="alert alert-danger">{{ $message }}</div>
              @enderror 
            </div>
            <div class="form-group form-group-default required">
              <label for="body_fr">Tournament Player</label>
              <input type="text" class="form-control @error('Player') is-invalid @enderror" required="" placeholder="ex:Content Player" id="Player" name="Player">
              @error('Player')
                <div class="alert alert-danger">{{ $message }}</div>
              @enderror 
            </div>
           <button class="btn btn-success btn-cons btn-animated from-left fa fa-save pull-right" type="submit">
            <span>save</span>
          </button>
        </div>
      </div>
      </form>
      <!-- END card -->
    </div>
    <div class="col-lg-6">
      <!-- START card -->
      <div class="card card-default">
        <div class="card-header ">
          <div class="card-title">
            Drag and drop Image Here 
          </div>
        </div>
        <div class="card-body no-scroll no-padding">
          <form method="post" action="{{url('Dashboard/image/upload/store')}}" enctype="multipart/form-data" class="dropzone" id="dropzone">
            @csrf
          </form> 
      </div>
    </div>
    <!-- END card -->
  </div>
</div>
<!-- END card -->
</div>
</div>
<!-- END CONTAINER FLUID -->
@endsection