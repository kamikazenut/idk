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
          <li class="breadcrumb-item"><a href="{{ route('Posts.index') }}">Games</a></li>
          <li class="breadcrumb-item active">Edit Game</li>
        </ol>
        <!-- END BREADCRUMB -->
        <div class="container-md-height">
          <div class="row">
            <!-- START card -->
            <div class="card card-transparent">
              <div class="card-body">
                <h3><i class="fa  fa-gamepad"></i> Edit {{ $Post->Title_en }}</h3>
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
      <div class="col-lg-9">
        <!-- START card -->
        <div class="card card-default">
          <div class="card-header ">
            <div class="card-title">
              Edit {{ $Post->Title_en }}
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
            <form action="{{ route('Posts.update',$Post->slug) }}" method="POST"  role="form" enctype="multipart/form-data">
            @csrf
            @method('PATCH')
            <div class="form-group form-group-default required">
              <label for="Title_en">Game Title</label>
              <input type="text" class="form-control @error('Title_en') is-invalid @enderror" required="" placeholder="ex: Game English" id="Title_en" name="Title_en" value="{{ $Post->Title_en }}">
              @error('Title_en')
                <div class="alert alert-danger">{{ $message }}</div>
              @enderror 
            </div>
            <!-- START card -->
            <div class="card card-default">
              <div class="card-header ">
                <div class="card-title">Game Content English
                </div>
              </div>
              <div class="card-body no-scroll card-toolbar">
                <div class="summernote-wrapper">
                  <textarea  id='summernote' name="body_en">{{ $Post->body_en }}</textarea>
                </div>
              </div>
            </div>
            <!-- END card -->
            <!-- START card -->
            <div class="card card-transparent">
              <div class="card-header ">
                <div class="card-title">Languages
                </div>
              </div>
              <div class="card-body no-padding">
                <div class="row">
                  <div class="col-xl-12">
                    <div class="card card-transparent flex-row">
                      <ul class="nav nav-tabs nav-tabs-simple nav-tabs-left bg-white" id="tab-3">
                        <li class="nav-item">
                          <a href="#"  data-toggle="tab" data-target="#French">French</a>
                        </li>
                        <li class="nav-item">
                          <a href="#" data-toggle="tab" data-target="#Arabic">Arabic</a>
                        </li>
                      </ul>
                      <div class="tab-content bg-white col-xl-11">
                        <div class="tab-pane" id="French">
                          <div class="form-group form-group-default required">
                            <label>Game Title French</label>
                            <input type="text" name="Title_fr" class="form-control" required="" placeholder="ex:  The title Game" value="{{ $Post->Title_fr }}"> 
                          </div>
                          <!-- START card -->
                          <div class="form-group">
                            <textarea class="form-control" name="body_fr" placeholder="Game Content French" rows="10">{{ $Post->body_fr }}</textarea>
                          </div>
                        </div>
                        <div class="tab-pane active" id="Arabic">
                          <div class="form-group form-group-default required">
                            <label>Game Title Arabic</label>
                            <input type="text" class="form-control" name="Title_ar" required="" placeholder="ex:  The title Game" value="{{ $Post->Title_ar }}"> 
                          </div>
                          <!-- START card -->
                          <div class="form-group">
                            <textarea class="form-control" name="body_ar" placeholder="Game Content Arabic" rows="10">{{ $Post->body_ar }}</textarea>
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
      <div class="col-lg-3">
        <!-- START card -->
        <div class="card card-default">
          <div class="card-header ">
            <div class="card-title"> SEO Content </div>
          </div>
          <div class="card-body">
              <p>These are Default Game Category</p>
              <div class="form-group form-group-default form-group-default-select2 required">
                <label class="">Category</label>
                <select class="full-width" data-placeholder="Select Category" data-init-plugin="select2" name="category_id">
                  <!-- ============================================= links Content Start Post ============================================= -->
                  @if(isset($Post->Category->Title_en))
                   <option value="{{ $Post->Category->id }}">Your {{ $Post->Category->Title_en }}</option>
                  @else
                  @endif
                  <!-- ============================================= links Content Start Setting ============================================= -->
                  <!-- ============================================= links Content Start Setting ============================================= -->
                  @if($Categores !== NULL)
                  @foreach($Categores as $Category)
                  <option value="{{ $Category->id }}">{{ $Category->Title_en }}</option>
                  @endforeach
                  @else
                  <option value="0">NO Category</option>
                  @endif
                  <option value="0">NO Category</option>
                  <!-- ============================================= links Content Start Setting ============================================= -->
                </select>
              </div>
              <p>These are Default Game Author </p>
              <div class="form-group form-group-default form-group-default-select2 required">
                <label class="">Author</label>
                <select class="full-width" data-placeholder="Select Author" data-init-plugin="select2" name="author_id">
                  <!-- ============================================= links Content Start Post ============================================= -->
                  @if(isset($Post->User->name))
                   <option value="{{ $Post->User->id }}">Author {{ $Post->User->name }}</option>
                  @else
                  @endif
                  <!-- ============================================= links Content Start Setting ============================================= -->
                  <!-- ============================================= links Content Start Setting ============================================= -->
                  @if($Users !== NULL)
                  @foreach($Users as $Author)
                  <option value="{{ $Author->id }}">{{ $Author->name }}</option>
                  @endforeach
                  @else
                  <option value="0">NO Author</option>
                  @endif
                  <option value="0">NO Author</option>
                  <!-- ============================================= links Content Start Setting ============================================= -->
                </select>
              </div>
            <div class="form-group form-group-default input-group">
              <div class="form-input-group">
                <label>Meta Description</label>
                <input type="text" class="form-control" placeholder="Game Content Meta" name="meta_description" value="{{ $Post->meta_description }}">
              </div>
            </div>
            <div class="form-group form-group-default input-group">
              <div class="form-input-group">
                <label>Meta Keywords</label>
                <input type="text" class="form-control" placeholder="Game Content Description" name="meta_keywords" value="{{ $Post->meta_keywords }}">
              </div>
            </div>
            <div class="form-group form-group-default input-group">
              <div class="form-input-group">
                <label>Size (20G - 10MB)</label>
                <input type="text" class="form-control" placeholder="Game (20G - 10MB)" name="seo_title" value="{{ $Post->seo_title }}">
              </div>
            </div>
            <div class="form-group form-group-default input-group">
              <div class="form-input-group">
                <label>Downloud</label>
                <input type="text" class="form-control" placeholder="Downloud Link" name="Downloud" value="{{ $Post->Downloud }}">
              </div>
            </div>
            <label>Featured</label>
            <input type="checkbox" data-init-plugin="switchery"  name="featured" 
            <?php if($Post->featured == 'on') {
            echo "checked";
            }else{
            echo "value='on'";
            }
            ?> />
            <span> Dont Change Image </span>
            <input type="checkbox" id="button"  onclick="myFunction()"> 
            <script>  
              function myFunction() {
                var myobj = document.getElementById("demo");
                myobj.remove();
              } 
            </script>
            <!-- =================== messages ============================ -->
            <input type="hidden"  name="ImageUpload_id" value="{{ $Post->ImageUpload_id }}">
            <input  type="hidden"  name="ImageUpload_id" value="{{ $ImageUpload }}" id="demo">
            <!-- =================== messages ============================ -->         
            </form>
          </div>
        </div>
        <!-- END card -->
        <!-- START card -->
        <div class="card card-default">
          <div class="card-header ">
            <div class="card-title">
              Drag and drop Game Upload 
            </div>
          </div>
          <div class="card-body no-scroll no-padding">
          <form method="post" 
          action="{!! url('Dashboard/image/upload/store') !!}"
          enctype="multipart/form-data" 
          class="dropzone"
          id="dropzone">
          <span class="thumbnail-wrapper d48 circul2 inline">
          @if(isset($Post->ImageUpload->filename))
          <img src="{{ asset($Post->ImageUpload->filename) }}" alt="Your News" 
          data-src="{{ asset($Post->ImageUpload->filename) }}" width="42" height="42">
          @else
          <img alt="News" width="42" height="42">
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
<!-- END CONTAINER FLUID -->
</div>
<!-- END PAGE CONTENT -->
@endsection