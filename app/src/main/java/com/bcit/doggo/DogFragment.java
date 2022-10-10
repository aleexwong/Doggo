package com.bcit.doggo;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import android.os.Handler;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;


import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.Objects;
import java.util.Random;


public class DogFragment extends Fragment {
    FirebaseUser userFirebase;
    FirebaseDatabase firebaseDatabase;
    FirebaseFirestore firebaseFirestore;
    DocumentReference docRef;
    FirebaseAuth mAuth;
    String id = LoginFragment.uid;
    String userId;
    int counterShow = 5;


    public DogFragment() {
        // Required empty public constructor
    }


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        firebaseDatabase = FirebaseDatabase.getInstance();
        firebaseFirestore = FirebaseFirestore.getInstance();
        mAuth = FirebaseAuth.getInstance();
        userId = Objects.requireNonNull(mAuth.getCurrentUser()).getUid();
        docRef = firebaseFirestore.collection("users").document(userId);
        if (getArguments() != null) {
            getData();
        }
    }

    private void getData()
    {
        docRef.get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
            @Override
            public void onSuccess(DocumentSnapshot documentSnapshot) {
                User user = documentSnapshot.toObject(User.class);
                if (user!= null)
                {
                    System.out.println(userId);
                    String name = user.getName();
                    int correct = user.getCorrect();
                    int question = user.getQuestion();
                    System.out.println(correct);
                    System.out.println(question);
                    System.out.println(name);
                }
            }
        });
    }

    private void addToDataCorrect()
    {
        docRef.get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
            @Override
            public void onSuccess(DocumentSnapshot documentSnapshot) {
                User user = documentSnapshot.toObject(User.class);
                if (user!= null)
                {
                    userFirebase = mAuth.getCurrentUser();
                    String userFirebaseEmail = userFirebase.getEmail();
                    String userFirebaseName = user.getName();
                    user.setName(userFirebaseName);
                    user.setCorrect(1);
                    user.setQuestion(1);
                    user.setEmailAddress(userFirebaseEmail);
                    docRef.set(user);
                }
            }
        });
    }

    private void addToDataIncorrect()
    {
        docRef.get().addOnSuccessListener(new OnSuccessListener<DocumentSnapshot>() {
            @Override
            public void onSuccess(DocumentSnapshot documentSnapshot) {
                User user = documentSnapshot.toObject(User.class);
                if (user!= null)
                {
                    userFirebase = mAuth.getCurrentUser();
                    String userFirebaseEmail = userFirebase.getEmail();
                    String userFirebaseName = user.getName();
                    user.setName(userFirebaseName);
                    user.setCorrect(0);
                    user.setQuestion(1);
                    user.setEmailAddress(userFirebaseEmail);
                    docRef.set(user);
                }
            }
        });
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_dog, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        ImageView imageView = view.findViewById(R.id.imageView_Dog);
        Button button = view.findViewById(R.id.button_dog);
        Button button_quiz_one = view.findViewById(R.id.button_dog_answer_one);
        Button button_quiz_two = view.findViewById(R.id.button_dog_answer_two);
        Button button_quiz_three = view.findViewById(R.id.button_dog_answer_three);
        Button button_quiz_four = view.findViewById(R.id.button_dog_answer_four);
        Button button_end = view.findViewById(R.id.button_dog_end);

        // initially the quiz buttons 1 - 4 and ending button are hidden!
        button_quiz_one.setVisibility(View.GONE);
        button_quiz_two.setVisibility(View.GONE);
        button_quiz_three.setVisibility(View.GONE);
        button_quiz_four.setVisibility(View.GONE);
        button_end.setVisibility(View.GONE);

        DogRepository DogRepository = new DogRepository();
        DogViewModel dogViewModel = new DogViewModel(DogRepository);


        DogView dogView = new DogView() {
            @Override
            public void onUpdateDogFragment(Dog dog) {
                imageView.setImageBitmap(dog.getBitmap());
            }
        };

        button.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View view) {
                // hides the button start, show the end button
                button.setVisibility(View.GONE);
                button_quiz_one.setVisibility(View.VISIBLE);
                button_quiz_two.setVisibility(View.VISIBLE);
                button_quiz_three.setVisibility(View.VISIBLE);
                button_quiz_four.setVisibility(View.VISIBLE);
                button_end.setVisibility(View.VISIBLE);

                // reset all buttons colours
                button_quiz_one.setBackgroundColor(getResources().getColor(R.color.blue));
                button_quiz_two.setBackgroundColor(getResources().getColor(R.color.blue));
                button_quiz_three.setBackgroundColor(getResources().getColor(R.color.blue));
                button_quiz_four.setBackgroundColor(getResources().getColor(R.color.blue));

                // set counter 0 for app development
                int counter = new Random().nextInt(4);
                dogViewModel.getRandomDogFromRepo(dogView);
                String correctQuizAns = DogRepository.getDogNameFromPicture();
                String[] quizAnswers = getResources().getStringArray(R.array.quiz_one);


                // generates random answers from the String Array
                int randomIndex = new Random().nextInt(quizAnswers.length);
                int randomIndex2 = new Random().nextInt(quizAnswers.length);
                int randomIndex3 = new Random().nextInt(quizAnswers.length);
                int randomIndex4 = new Random().nextInt(quizAnswers.length);

                String quizAnswerA = quizAnswers[randomIndex];
                String quizAnswerB = quizAnswers[randomIndex2];
                String quizAnswerC = quizAnswers[randomIndex3];
                String quizAnswerD = quizAnswers[randomIndex4];

                // logic to randomly place the correct answer!
                if(counter == 0) {
                    button_quiz_one.setText(correctQuizAns);
                    button_quiz_two.setText(quizAnswerB);
                    button_quiz_three.setText(quizAnswerC);
                    button_quiz_four.setText(quizAnswerD);
                }

                if(counter == 1) {
                    button_quiz_one.setText(quizAnswerA);
                    button_quiz_two.setText(correctQuizAns);
                    button_quiz_three.setText(quizAnswerC);
                    button_quiz_four.setText(quizAnswerD);
                }

                if(counter == 2) {
                    button_quiz_one.setText(quizAnswerA);
                    button_quiz_two.setText(quizAnswerB);
                    button_quiz_three.setText(correctQuizAns);
                    button_quiz_four.setText(quizAnswerD);
                }

                if(counter == 3) {
                    button_quiz_one.setText(quizAnswerA);
                    button_quiz_two.setText(quizAnswerB);
                    button_quiz_three.setText(quizAnswerC);
                    button_quiz_four.setText(correctQuizAns);
                }
                button_quiz_one.setOnClickListener(new View.OnClickListener(){
                    @Override
                    public void onClick(View view){
                        if(button_quiz_one.getText() == correctQuizAns){
                            button_quiz_one.setBackgroundColor(Color.GREEN);
                            addToDataCorrect();
                            Handler handler = new Handler();
                            handler.postDelayed(new Runnable() {
                                public void run() {
                                    button.performClick();
                                }
                            }, 1500);
                        } else {
                            button_quiz_one.setBackgroundColor(Color.RED);
                            addToDataIncorrect();
                            switch (counter) {
                                case 0:
                                    button_quiz_one.setBackgroundColor(Color.GREEN);
                                    break;
                                case 1:
                                    button_quiz_two.setBackgroundColor(Color.GREEN);
                                    break;
                                case 2:
                                    button_quiz_three.setBackgroundColor(Color.GREEN);
                                    break;
                                case 3:
                                    button_quiz_four.setBackgroundColor(Color.GREEN);
                                    break;
                            }
                            Handler handler = new Handler();
                            handler.postDelayed(new Runnable() {
                                public void run() {
                                    button.performClick();
                                }
                            }, 1500);
                        }
                    }
                });
                button_quiz_two.setOnClickListener(new View.OnClickListener(){
                    @Override
                    public void onClick(View view){
                        if(button_quiz_two.getText() == correctQuizAns){
                            button_quiz_two.setBackgroundColor(Color.GREEN);
                            addToDataCorrect();
                            Handler handler = new Handler();
                            handler.postDelayed(new Runnable() {
                                public void run() {
                                    button.performClick();
                                }
                            }, 1500);
                        } else {
                            button_quiz_two.setBackgroundColor(Color.RED);
                            addToDataIncorrect();
                            switch (counter) {
                                case 0:
                                    button_quiz_one.setBackgroundColor(Color.GREEN);
                                    break;
                                case 1:
                                    button_quiz_two.setBackgroundColor(Color.GREEN);
                                    break;
                                case 2:
                                    button_quiz_three.setBackgroundColor(Color.GREEN);
                                    break;
                                case 3:
                                    button_quiz_four.setBackgroundColor(Color.GREEN);
                                    break;
                            }
                            Handler handler = new Handler();
                            handler.postDelayed(new Runnable() {
                                public void run() {
                                    button.performClick();
                                }
                            }, 1500);
                        }
                    }
                });
                button_quiz_three.setOnClickListener(new View.OnClickListener(){
                    @Override
                    public void onClick(View view){
                        if(button_quiz_three.getText() == correctQuizAns){
                            addToDataCorrect();
                            button_quiz_three.setBackgroundColor(Color.GREEN);
                            Handler handler = new Handler();
                            handler.postDelayed(new Runnable() {
                                public void run() {
                                    button.performClick();
                                }
                            }, 1500);
                        } else {
                            button_quiz_three.setBackgroundColor(Color.RED);
                            addToDataIncorrect();
                            switch (counter) {
                                case 0:
                                    button_quiz_one.setBackgroundColor(Color.GREEN);
                                    break;
                                case 1:
                                    button_quiz_two.setBackgroundColor(Color.GREEN);
                                    break;
                                case 2:
                                    button_quiz_three.setBackgroundColor(Color.GREEN);
                                    break;
                                case 3:
                                    button_quiz_four.setBackgroundColor(Color.GREEN);
                                    break;
                            }
                            Handler handler = new Handler();
                            handler.postDelayed(new Runnable() {
                                public void run() {
                                    button.performClick();
                                }
                            }, 1500);
                        }
                    }
                });
                button_quiz_four.setOnClickListener(new View.OnClickListener(){
                    @Override
                    public void onClick(View view){
                        if(button_quiz_four.getText() == correctQuizAns){
                            addToDataCorrect();
                            button_quiz_four.setBackgroundColor(Color.GREEN);
                            Handler handler = new Handler();
                            handler.postDelayed(new Runnable() {
                                public void run() {
                                    button.performClick();
                                }
                            }, 1500);
                        } else {
                            button_quiz_four.setBackgroundColor(Color.RED);
                            addToDataIncorrect();
                            switch (counter) {
                                case 0:
                                    button_quiz_one.setBackgroundColor(Color.GREEN);
                                    break;
                                case 1:
                                    button_quiz_two.setBackgroundColor(Color.GREEN);
                                    break;
                                case 2:
                                    button_quiz_three.setBackgroundColor(Color.GREEN);
                                    break;
                                case 3:
                                    button_quiz_four.setBackgroundColor(Color.GREEN);
                                    break;
                            }
                            Handler handler = new Handler();
                            handler.postDelayed(new Runnable() {
                                public void run() {
                                    button.performClick();
                                }
                            }, 1500);
                        }
                    }
                });
            }
        });
        button_end.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(getContext(),UserProfile.class);
                startActivity(intent);
            }
        });
    }
}