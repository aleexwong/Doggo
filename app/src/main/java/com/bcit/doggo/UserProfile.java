package com.bcit.doggo;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

import com.google.firebase.database.FirebaseDatabase;

import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;

import com.google.firebase.firestore.FirebaseFirestore;

import com.google.firebase.storage.FileDownloadTask;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;
import com.google.firebase.storage.UploadTask;

import java.io.File;
import java.io.IOException;

public class UserProfile extends AppCompatActivity {

    FirebaseDatabase firebaseDatabase;
    StorageReference storageReference;
    FirebaseFirestore firebaseFirestore;
    DocumentReference docRef;
    FirebaseAuth mAuth;

    String userId;
    TextView rankNo;
    TextView username;
    TextView correct;
    TextView question;

    public static final String SIGNED_OUT = "com.bcit.doggo.SIGNEDOUT";

    Uri imageUri;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_profile);

        firebaseDatabase = FirebaseDatabase.getInstance();
        firebaseFirestore = FirebaseFirestore.getInstance();
        mAuth = FirebaseAuth.getInstance();

        username = findViewById(R.id.textView_main_username);
        correct = findViewById(R.id.textView_main_corrects_number);
        question = findViewById(R.id.textView_main_questions_number);
        rankNo = findViewById(R.id.textView_main_rank_number);


        startGame();
        signOut();
    }

    @Override
    protected void onStart() {
        super.onStart();

        FirebaseUser user = mAuth.getCurrentUser();
        if(user==null){
            Intent intent = new Intent(UserProfile.this, MainActivity.class);
            startActivity(intent);
            finish();
        } else {
            userId = user.getUid();
            getData();
            displayUserProfile();
            uploadImage();
        }
    }

    private void getData()
    {
        docRef = firebaseFirestore.collection("users").document(userId);
        docRef.get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
            @SuppressLint("SetTextI18n")
            @Override
            public void onSuccess(DocumentSnapshot documentSnapshot) {
                User user = documentSnapshot.toObject(User.class);
                if (user!= null)
                {
                    username.setText(user.getName());
                    correct.setText(String.valueOf(user.getCorrect()));
                    question.setText(String.valueOf(user.getQuestion()));
                    float num_of_corrects = user.getCorrect();
                    float num_of_questions = user.getQuestion();
                    float percentage_correct = (num_of_corrects / num_of_questions) * 100;
                    rankNo.setText(String.format("%.00f", percentage_correct)+ "%");

                }
            }
        });
    }

    private void displayUserProfile()
    {
        storageReference = FirebaseStorage.getInstance().getReference().child("images/" + userId);

        try {
            final File localFile = File.createTempFile(userId, "");
            storageReference.getFile(localFile)
                    .addOnSuccessListener(new OnSuccessListener<FileDownloadTask.TaskSnapshot> () {
                        @Override
                        public void onSuccess(FileDownloadTask.TaskSnapshot taskSnapshot) {
                            Bitmap bitmap = BitmapFactory.decodeFile(localFile.getAbsolutePath());
                            ((ImageView) findViewById(R.id.imageView_main_profile)).setImageBitmap(bitmap);
                        }

                    });
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void uploadImage()
    {
        Button buttonUploadingImage = (Button) findViewById(R.id.button_main_update);
        buttonUploadingImage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent();
                intent.setType("image/*");
                intent.setAction(Intent.ACTION_GET_CONTENT);
                startActivityForResult(intent, 100);
            }
        });
    }

    private void startGame()
    {
        Button doggoPlayButton = findViewById(R.id.button_main_start);
        doggoPlayButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(getBaseContext(), UserDoggo.class);
                startActivity(intent);
            }
        });
    }

    private void signOut()
    {
        Button logout = (Button) findViewById(R.id.button_main_logout);
        logout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                mAuth.signOut();
                Intent intent = new Intent(getBaseContext(),MainActivity.class);
                String signOut = "Sign out";
                intent.putExtra(SIGNED_OUT, signOut);
                startActivity(intent);
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        storageReference = FirebaseStorage.getInstance().getReference("images/" + userId);
        storageReference.delete();

        if (requestCode == 100 && data != null && data.getData() != null)
        {
            ImageView imageView = findViewById(R.id.imageView_main_profile);

            imageUri = data.getData();
            imageView.setImageURI(imageUri);
        }

        storageReference.putFile(imageUri)
                .addOnSuccessListener(new OnSuccessListener<UploadTask.TaskSnapshot>() {
                    @Override
                    public void onSuccess(UploadTask.TaskSnapshot taskSnapshot) {
                        Toast.makeText(UserProfile.this, "Successfully uploaded", Toast.LENGTH_SHORT).show();
                    }
                }).addOnFailureListener(new OnFailureListener() {
            @Override
            public void onFailure(@NonNull Exception e) {
                Toast.makeText(UserProfile.this, "failed to upload", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
