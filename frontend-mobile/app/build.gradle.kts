plugins {
    alias(libs.plugins.androidApplication)
    alias(libs.plugins.jetbrainsKotlinAndroid)
}

android {
    namespace = "edu.cit.syncra"
    compileSdk = 36 // Consider using API 34 or 33 for wider compatibility

    defaultConfig {
        applicationId = "edu.cit.syncra"
        minSdk = 26  // Lowered minSdk to 21 for broader compatibility
        targetSdk = 34 // Target API 34 for newer features but still supports older devices
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildFeatures {
        viewBinding = true
        

    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }

    kotlinOptions {
        jvmTarget = "1.8"
    }
}

dependencies {
    implementation ("androidx.swiperefreshlayout:swiperefreshlayout:1.1.0")
    implementation ("androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0")
    // Lifecycle dependencies
    implementation ("androidx.lifecycle:lifecycle-livedata-ktx:2.6.0")
    implementation ("androidx.lifecycle:lifecycle-viewmodel-ktx:2.6.0")
    // Kotlin extensions for LiveData
    implementation ("androidx.lifecycle:lifecycle-runtime-ktx:2.6.0")
    implementation ("androidx.recyclerview:recyclerview:1.2.1")  // Or a more recent version
    implementation("androidx.fragment:fragment-ktx:1.6.2")



    implementation ("androidx.constraintlayout:constraintlayout:2.1.4") // or the latest version
    implementation ("androidx.recyclerview:recyclerview:1.2.1") // or the latest version
    implementation ("androidx.core:core-ktx:1.8.0") // Make sure this is added as well
    implementation("androidx.cardview:cardview:1.0.0")
    implementation("com.google.android.material:material:1.11.0") // or latest
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.github.dhaval2404:imagepicker:2.1")
    implementation("io.coil-kt:coil:2.4.0")
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    implementation("com.google.android.gms:play-services-auth:21.0.0")
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.material)
    implementation(libs.androidx.activity)
    implementation(libs.androidx.constraintlayout)
    implementation(libs.androidx.recyclerview)
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
}
