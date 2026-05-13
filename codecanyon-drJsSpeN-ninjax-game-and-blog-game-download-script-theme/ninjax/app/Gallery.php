<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\ImageUpload;

class Gallery extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [

     'Title_ar','Title_en','Title_fr','body_ar','body_en','body_fr','ImageUpload_id','Prize','Platform','Player'
     
    ];

    public function ImageUpload()
    {
        return $this->belongsTo(ImageUpload::class,'ImageUpload_id');
    }
}
