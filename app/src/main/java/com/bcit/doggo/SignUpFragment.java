package com.bcit.doggo;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import android.util.Patterns;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FirebaseFirestore;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link SignUpFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class SignUpFragment extends Fragment {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String USER_REGISTER = "com.bcit.doggo.TABNAME";
    public String pageName = "SIGN UP";
    public FirebaseAuth mAuth;
    public String userID;

    // TODO: Rename and change types of parameters

    public SignUpFragment() {
        // Required empty public constructor
    }

    // TODO: Rename and change types and number of parameters
    public static SignUpFragment newInstance() {
        SignUpFragment fragment = new SignUpFragment();
        Bundle args = new Bundle();
        args.putString(USER_REGISTER, "SIGN UP");
        fragment.setArguments(args);
        return fragment;
    }

    public String getPageName() {
        return this.pageName;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_sign_up, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        mAuth = FirebaseAuth.getInstance();
        EditText fullName = view.findViewById(R.id.edittext_signup_full_name);
        EditText emailAddress = view.findViewById(R.id.edittext_signup_email);
        EditText passWord = view.findViewById(R.id.edittext_signup_password);
        Button createAccount = view.findViewById(R.id.button_signup_createaccount);
        createAccount.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String email = emailAddress.getText().toString().trim();
                String password = passWord.getText().toString().trim();
                String name = fullName.getText().toString().trim();
                FirebaseFirestore db = FirebaseFirestore.getInstance();

                if (name.isEmpty()) {
                    fullName.setError("Name parameter is empty");
                    fullName.requestFocus();
                    return;
                }

                if (email.isEmpty()) {
                    emailAddress.setError("Email Address parameter is empty");
                    emailAddress.requestFocus();
                    return;
                }

                if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                    emailAddress.setError("Please provide valid email");
                    emailAddress.requestFocus();
                    return;
                }

                if (password.isEmpty()) {
                    passWord.setError("Password parameter is empty");
                    passWord.requestFocus();
                    return;
                }

                if (password.length() < 6) {
                    passWord.setError("Password does not meet valid length");
                    passWord.requestFocus();
                    return;
                }
                mAuth.createUserWithEmailAndPassword(email, password)
                        .addOnCompleteListener(new OnCompleteListener<AuthResult>() {
                            @Override
                            public void onComplete(@NonNull Task<AuthResult> task) {
                                if (task.isSuccessful()) {
                                    Toast.makeText(getContext(), "User has been registered successfully!", Toast.LENGTH_SHORT).show();
                                    userID = Objects.requireNonNull(mAuth.getCurrentUser()).getUid();
                                    DocumentReference documentReference = db.collection("users").document(userID);
                                    Map<String, Object> user = new HashMap<>();
                                    user.put("name", name);
                                    user.put("emailAddress", email);
                                    user.put("correct", 0);
                                    user.put("question", 0);
                                    documentReference.set(user).addOnSuccessListener(new OnSuccessListener<Void>() {
                                        @Override
                                        public void onSuccess(Void unused) {
                                            Toast.makeText(getContext(), "Success: User profile created for " + userID, Toast.LENGTH_SHORT).show();

                                        }
                                    });
                                    ((MainActivity) requireActivity()).selectTab(0);
                                } else {
                                    Toast.makeText(getContext(), "Failed to register! " + task.getException(), Toast.LENGTH_SHORT).show();
                                    System.out.println("Why did it not work?");
                                }
                            }
                        });
            }
        });
    }
}