package com.bcit.doggo;

import java.io.Serializable;

public class User implements Serializable {
    private String name;
    private String emailAddress;
    private int rankNo;
    private int correct;
    private int question;


    public User() {

    }

    public User(String name, String emailAddress) {
        this.name = name;
        this.emailAddress = emailAddress;
        this.correct = 1000;
        this.rankNo = 0;
        this.question = 0;
    }

    public String getName() {
        return name;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setName(String name){
        this.name = name;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public int getRankNo(){
        return rankNo;
    }

    public int getCorrect() {
        return correct;
    }

    public int getQuestion() {
        return question;
    }

    public void setCorrect(int correct){
        int correctSoFar = getCorrect();
        correctSoFar += correct;
        this.correct = correctSoFar;
    }
    public void setQuestion(int question){
        int questionSoFar = getQuestion();
        questionSoFar += question;
        this.question = questionSoFar;
    }
}
