package com.bcit.doggo;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;

import com.google.gson.Gson;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

enum RequestType {
    IMAGE,
    JSON,
}

public class DogRepository<T> {

    String URL = "https://dog.ceo/api/breeds/image/random";

    String dogNameFromPicture = "initial";

    public DogRepository() {}

    public Future<Bitmap> executeRequest() throws ExecutionException, InterruptedException {

        ExecutorService executor = Executors.newSingleThreadExecutor();

        Future<String> jsonResult = executor.submit(makeRequest(RequestType.JSON, URL));

        return executor.submit(makeRequest(RequestType.IMAGE, jsonResult.get()));
    }

    public Callable makeRequest(RequestType type, String URL) {

        return new Callable() {
            @Override
            public T call() {
                T response = null;
                try {
                    java.net.URL url = new URL(URL);
                    HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
                    urlConnection.setRequestMethod("GET"); //GET is default

                    //read the response
                    InputStream inputStream = new BufferedInputStream(urlConnection.getInputStream());
                    if (type == RequestType.JSON) {
                        response = (T)ParseImageUrlFromJson(convertStreamToString(inputStream));

                    }else if (type == RequestType.IMAGE){
                        response = (T) BitmapFactory.decodeStream(inputStream);
                    }

                    return response;

                } catch (Exception e) {
                    e.getMessage();
                    return null;
                }
            }
        };
    }

    String ParseImageUrlFromJson(String jsonStr) {
        if (jsonStr != null) {
            Gson gson = new Gson();
            //System.out.println(jsonStr);
            DogBase.Root base = gson.fromJson(jsonStr, DogBase.Root.class);
            //System.out.println(base.message);
            String str = base.message;
            String[] listOfMessageStrings = str.split("/");
            int positionOfArray = 4;
            String dogName = listOfMessageStrings[positionOfArray];
            System.out.println(dogName);
            setCorrectDogNameAnswer(dogName);
            return base.message;

        } else {
            Log.e("MainActivity", "json is null");
            return null;
        }
    }

    public void setCorrectDogNameAnswer(String dogNameFromPicture){
        this.dogNameFromPicture = dogNameFromPicture;
    }

    public String getDogNameFromPicture() {
        return dogNameFromPicture;
    }

    private String convertStreamToString(InputStream is) {
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        StringBuilder sb = new StringBuilder();
        String line;
        try {
            while ((line = reader.readLine()) != null) {
                sb.append(line).append('\n');
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                is.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return sb.toString();
    }

    public Dog getRandomDog() {

        Bitmap bitmapResult = null;
        try {
            bitmapResult = executeRequest().get(); //blocker method
        } catch (ExecutionException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        return new Dog(bitmapResult, "no facts yet");
    }

}

