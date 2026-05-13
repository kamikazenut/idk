<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\ImageUpload;

class AdSense extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'Location', 'name', 'Display','Type','Active','ImageUpload_id','url','code'
    ];
    
    public function ImageUpload()
    {
        return $this->belongsTo(ImageUpload::class,'ImageUpload_id');
    }
}
