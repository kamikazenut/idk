@extends('Dashboard.main')

@section('Dashboard')
<div class="content  p-b-50">
  <!-- START PAGE COVER -->
  <div class="jumbotron page-cover" data-pages="parallax">
    <div class=" container-fluid  container-fixed-lg">
      <div class="inner">
        <!-- START BREADCRUMB -->
        <ol class="breadcrumb">  
          <li class="breadcrumb-item"><a href="{{ url('admin') }}">Dashboard</a></li>
          <li class="breadcrumb-item"><a href="{{ route('AdSense.index') }}">Ads </a></li>
          <li class="breadcrumb-item active">Edit {{ $AdSense->name }}</li>
        </ol>
        <!-- END BREADCRUMB -->
        <div class="container-md-height">
          <div class="row">
            <!-- START card -->
            <div class="card card-transparent">
              <div class="card-body">
                <h3><i class="pg-grid"></i> Edit {{ $AdSense->name }}</h3>
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
      <div class="col-lg-8">
        <!-- START card -->
        <div class="card card-default">
          <div class="card-header ">
            <div class="card-title">
              Edit {{ $AdSense->name }}
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
            <!-- ============================================= links Content Start Setting ============================================= -->
            <form action="{{ route('AdSense.update',$AdSense->name) }}" method="POST"  role="form" enctype="multipart/form-data">
            @csrf
            @method('PATCH')
            <div class="row">
              <p>These are Default Ads Location</p>
              <div class="form-group form-group-default form-group-default-select2 required">
                <label for="Location">Location</label>
                <select class="full-width" data-placeholder="Select Location" data-init-plugin="select2" name="Location">
                  <!-- ============================================= links Content Start Post ============================================= -->
                  @if(isset($AdSense->Location))
                   <option value="{{ $AdSense->Location }}">Your {{ $AdSense->Location }}</option>
                  @else
                  @endif
                  <!-- ============================================= links Content Start Setting ============================================= -->
                  <option value="Home">Home</option>
                  <option value="Header">Header</option>
                  <option value="Footer">Footer</option>
                  <option value="Single">Post Single</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div class="form-group form-group-default required">
              <label for="name">Ads Title</label>
              <input type="text" class="form-control @error('name') is-invalid @enderror" placeholder="ex: This Title Ads" name="name" value="{{ $AdSense->name }}">
              @error('name')
                <div class="alert alert-danger">{{ $message }}</div>
              @enderror  
            </div>
            <div class="form-group form-group-default required">
              <label for="Display">Your Display Name</label>
              <input type="text" class="form-control @error('name') is-invalid @enderror" placeholder="ex:  Your Display Name" name="Display" value="{{ $AdSense->Display }}">
              @error('Display')
                <div class="alert alert-danger">{{ $message }}</div>
              @enderror 
            </div>
            <div class="row">
              <p>These are Default Ads Type</p>
              <div class="form-group form-group-default form-group-default-select2 required">
                <label for="Type">Type</label>
                <select class="full-width" data-placeholder="Select Type" data-init-plugin="select2" name="Type">
                  <option value="{{ $AdSense->Type }}">Type Is {{ $AdSense->Type }}</option>
                  <option value="Code">Code</option>
                  <option value="image">image</option>
                </select>
              </div>
            </div>
            <!-- START card -->
            <div class="card card-transparent">
              <div class="card-body no-padding">
                <div class="row">
                  <div class="col-xl-12">
                    <div class="card card-transparent flex-row">
                      <ul class="nav nav-tabs nav-tabs-simple nav-tabs-left bg-white" id="tab-3">
                        <li class="nav-item">
                          <a href="#"  data-toggle="tab" data-target="#Image" class="padding-left"><i class="pg-image"></i> Image</a>
                        </li>
                        <li class="nav-item">
                          <a href="#" data-toggle="tab" data-target="#AdSense" class="padding-left"><i class="fa fa-google"></i> AdSense</a>
                        </li>
                      </ul>
                      <div class="tab-content bg-white col-xl-11">
                        <div class="tab-pane" id="Image">
                          <div class="form-group form-group-default required">
                            <label for="url">Your Url Image</label>
                            <input type="text" class="form-control @error('url') is-invalid @enderror" placeholder="ex:  Your Url Image" name="url" 
                                   value="{{ $AdSense->url }}"> 
                          </div>
                        </div>
                        <div class="tab-pane active" id="AdSense">
                          <div class="card-header ">
                            <div class="card-title"> Google AdSense Code
                            </div>
                          </div>
                          <div class="card-body no-scroll card-toolbar">
                            <div class="summernote-wrapper">
                              <textarea  id='summernote' name="code">{{ $AdSense->code }}</textarea>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- END card -->
            <button class="btn btn-success btn-cons btn-animated from-left fa fa-save pull-right" type="submit">
              <span>save</span>
            </button>
          </div>
        </div>
        <!-- END card -->
      </div>
      <div class="col-lg-4">
        <!-- START card -->
        <div class="card card-default">
          <div class="card-header ">
            <div class="card-title"> Control Ads </div>
          </div>
          <div class="card-body">
            <label for="Active">Active Ads</label>
            <input type="checkbox" data-init-plugin="switchery" name="Active" <?php if($AdSense->Active == 'on') {
                        echo "checked";
                       }else{
                        echo "value='on'";
                       }
                       ?> />
          </div>
        </div>
        <!-- END card -->
        </form>
        <!-- START card -->
        <div class="card card-default">
          <div class="card-header ">
            <div class="card-title">
              Drag and drop Image Here 
            </div>
          </div>
          <div class="card-body no-scroll no-padding">
          <form method="post" action="{{url('Dashboard/image/upload/store')}}" enctype="multipart/form-data" class="dropzone" id="dropzone">
                <span class="thumbnail-wrapper d48 circul2 inline">
                @if(isset($AdSense->ImageUpload->filename))
                 <img src="{!! asset($AdSense->ImageUpload->filename) !!}" alt="Your Image" data-src="{!! asset($AdSense->ImageUpload->filename) !!}" width="42" height="42">
                 @else
                 <img alt="Image" width="42" height="42">
                 @endif
                </span>
               @csrf
              </form>
        </div>
      </div>
      <!-- END card -->
    </div>
  </div>
  <!-- END card -->
</div>
@endsection