package com.bcit.doggo;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;
import androidx.viewpager2.widget.ViewPager2;

import android.app.ActionBar;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

import com.google.android.material.tabs.TabLayout;
import com.google.android.material.tabs.TabLayoutMediator;

import java.util.Objects;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Intent intent = getIntent();
        if (intent.hasExtra(UserProfile.SIGNED_OUT)) {
            Toast.makeText(this, "Logged out", Toast.LENGTH_SHORT).show();
        }

        Fragment loginFragment = LoginFragment.newInstance();
        Fragment signUpFragment = SignUpFragment.newInstance();

        Fragment[] fragments = {
                loginFragment,
                signUpFragment
        };

        ViewPager2 viewPager2 = findViewById(R.id.viewpager2_main);
        ViewPagerAdapter viewPagerAdapter = new ViewPagerAdapter(this, fragments);
        viewPager2.setAdapter(viewPagerAdapter);

        TabLayout tabLayout = findViewById(R.id.tablayout_main);
        TabLayoutMediator tabLayoutMediator = new TabLayoutMediator(tabLayout, viewPager2, new TabLayoutMediator.TabConfigurationStrategy() {
            @Override
            public void onConfigureTab(@NonNull TabLayout.Tab tab, int position) {
                tab.setText(fragments[position].requireArguments().getString("com.bcit.doggo.TABNAME"));
            }
        });
        tabLayoutMediator.attach();
    }

    public void selectTab(int position) {
        ViewPager2 viewPager2 = findViewById(R.id.viewpager2_main);
        viewPager2.setCurrentItem(position);
    }
}