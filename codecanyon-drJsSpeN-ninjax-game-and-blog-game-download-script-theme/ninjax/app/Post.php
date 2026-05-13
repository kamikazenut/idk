<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use App\Category;
use App\User;
use App\Comment;
use App\ImageUpload;

class Post extends Model
{

    use Sluggable;
     /**
     * Return the sluggable configuration array for this model.
     *
     * @return array
     */
    public function sluggable():array
    {
        return [
            'slug' => [
                'source' => 'Title_en'
            ]
        ];
    }
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
    'author_id', 'category_id','Title_ar','Title_en','Title_fr','body_ar','body_en',
    'body_fr','ImageUpload_id','slug','meta_description','meta_keywords','seo_title','Downloud','featured'
    ];

    // THIS function Category 
     public function Category()
    {
        return $this->belongsTo(Category::class,'category_id');
    }

    // THIS function User 
    public function User()
    {
        return $this->belongsTo(User::class,'author_id');
    } 

    public function ImageUpload()
    {
        return $this->belongsTo(ImageUpload::class,'ImageUpload_id');
    }
}
