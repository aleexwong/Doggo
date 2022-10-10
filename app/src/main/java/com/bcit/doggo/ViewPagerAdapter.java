package com.bcit.doggo;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.viewpager2.adapter.FragmentStateAdapter;

/**
 * A simple pager adapter that represents 5 ExampleFragment objects, in
 * sequence.
 */
class ViewPagerAdapter extends FragmentStateAdapter {

    /**
     * The number of pages to show
     */
//    private static final int NUM_PAGES = 5;
    Fragment[] fragments;
    public ViewPagerAdapter(FragmentActivity fa, Fragment[] fragments) {
        super(fa);
        this.fragments = fragments;
    }

    @Override
    public Fragment createFragment(int position) {
        return fragments[position]; //you will get an error here this is just a template
    }

    @Override
    public int getItemCount() {
        return fragments.length;
    }
}