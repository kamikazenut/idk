@extends('Dashboard.main')

@section('Dashboard')
<!-- START PAGE CONTENT -->
<div class="content">
  <!-- START PAGE COVER -->
  <div class="jumbotron page-cover" data-pages="parallax">
    <div class=" container-fluid  container-fixed-lg">
      <div class="inner">
        <!-- START BREADCRUMB -->
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="{{ url('admin') }}">Dashboard</a></li>
          <li class="breadcrumb-item"><a href="{{ route('Categories.index') }}">Categories</a></li>
          <li class="breadcrumb-item active">Edit Category</li>
        </ol>
        <!-- END BREADCRUMB -->
        <div class="container-md-height">
          <div class="row">
            <!-- START card -->
            <div class="card card-transparent">
              <div class="card-body">
                <h3><i class="pg-folder"></i> Edit {{ $Category->Title_en }}</h3>
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
      <div class="col-lg-12">
        <!-- START card -->
        <div class="card card-default">
          <div class="card-header ">
            <div class="card-title">
              Create your Category
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
            <form action="{{ route('Categories.update',$Category->slug) }}" method="POST"  role="form" enctype="multipart/form-data">
            @csrf
            @method('PATCH')
              <div class="form-group form-group-default required">
                <label class="fade" for="parent_id">Parent Category</label>
                <input type="number" class="form-control @error('parent_id') is-invalid @enderror" required="" placeholder="ex: 1 2 3"  name="parent_id" value="{{ $Category->parent_id }}">
                @error('parent_id')
                   <div class="alert alert-danger">{{ $message }}</div>
                @enderror
              </div>
              <div class="form-group form-group-default required">
                <label class="fade" for="order">Order Category</label>
                <input type="number" class="form-control @error('order') is-invalid @enderror" required="" placeholder="ex: 1 2 3" name="order" value="{{ $Category->order }}">
                @error('order')
                   <div class="alert alert-danger">{{ $message }}</div>
                @enderror
              </div>
              <div class="form-group form-group-default required">
                <label class="fade" for="Title_en">Title Category English</label>
                <input type="text" class="form-control" required="" placeholder="ex: Title Category" name="Title_en" value="{{ $Category->Title_en }}">
                @error('Title_en')
                   <div class="alert alert-danger">{{ $message }}</div>
                @enderror
              </div>
              <div class="form-group form-group-default required">
                <label class="fade" for="Title_ar">Title Category Arabic</label>
                <input type="text" class="form-control" required="" placeholder="ex: Title Category" name="Title_ar" value="{{ $Category->Title_ar }}">
                @error('Title_ar')
                   <div class="alert alert-danger">{{ $message }}</div>
                @enderror
              </div>
              <div class="form-group form-group-default required">
                <label class="fade" for="Title_fr">Title Category France</label>
                <input type="text" class="form-control" required="" placeholder="ex: Title Category" name="Title_fr" value="{{ $Category->Title_fr }}">
                @error('Title_fr')
                   <div class="alert alert-danger">{{ $message }}</div>
                @enderror
              </div>
              <div class="form-group form-group-default form-group-default-select2 required">
                <label class="fade" for="color">Category Color</label>
                <select class="full-width" data-placeholder="Select color" data-init-plugin="select2" name="color">
                  <option value="{{ $Category->color }}">{{ $Category->color }}</option>
                  <option value="danger">color Red</option>
                  <option value="primary">color primary</option>
                  <option value="complete">color complete</option>
                  <option value="success">color success</option>
                  <option value="info">color info</option>
                  <option value="warning">color warning</option>
                </select>
              </div>
              <button class="btn btn-success btn-cons btn-animated from-left fa fa-save pull-right" type="submit">
                <span>save</span>
              </button>
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