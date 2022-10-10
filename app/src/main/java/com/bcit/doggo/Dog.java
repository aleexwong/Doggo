package com.bcit.doggo;

import android.graphics.Bitmap;

public class Dog {

    private Bitmap bitmap;
    private String fact;

    public Dog(Bitmap bitmap, String face){
        this.bitmap = bitmap;
        this.fact = face;
    }

    public Bitmap getBitmap() {
        return bitmap;
    }

    public String getFact() {
        return fact;
    }
}
