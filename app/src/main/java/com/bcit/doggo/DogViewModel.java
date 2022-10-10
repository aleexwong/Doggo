package com.bcit.doggo;

public class DogViewModel {

    DogRepository dogRepository;

    public DogViewModel(DogRepository dogRepository){
        this.dogRepository = dogRepository;
    }

    public void getRandomDogFromRepo(DogView dogView){
        Dog dog = dogRepository.getRandomDog();
        dogView.onUpdateDogFragment(dog);
    }

}
