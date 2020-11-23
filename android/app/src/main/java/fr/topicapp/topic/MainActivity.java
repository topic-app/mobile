package fr.topicapp.topic;

import android.os.Bundle;
import android.view.Window;
import android.view.View;
import android.graphics.Color;
import android.view.WindowManager.LayoutParams;
import android.content.res.Resources;
import android.content.res.Configuration;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import expo.modules.splashscreen.singletons.SplashScreen;
import expo.modules.splashscreen.SplashScreenImageResizeMode;

public class MainActivity extends ReactActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // SplashScreen.show(...) has to be called after super.onCreate(...)
        // Below line is handled by '@expo/configure-splash-screen' command and it's
        // discouraged to modify it manually
        SplashScreen.show(this, SplashScreenImageResizeMode.CONTAIN, ReactRootView.class, true);

        // Set Android Navigation Bar to transparent if device is using fullscreen
        // gestures
        int isEdgeToEdgeEnabled = 0;
        Resources resources = this.getResources();
        int resourceId = resources.getIdentifier("config_navBarInteractionMode", "integer", "android");
        if (resourceId > 0) {
            isEdgeToEdgeEnabled = resources.getInteger(resourceId);
        }

        Window window = getWindow();
        View decorView = window.getDecorView();

        // Check if device is using fullscreen gestures
        if (isEdgeToEdgeEnabled == 2) {
            decorView.setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
            window.setNavigationBarColor(Color.TRANSPARENT);
        } else {
            // Device is using 2-button or 3-button navigation
            // Change Android Navigation Buttons to correct theme configuration
            int flags = decorView.getSystemUiVisibility();
            switch (getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK) {
                case Configuration.UI_MODE_NIGHT_YES:
                    window.setNavigationBarColor(0xff000000);
                    flags &= ~View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
                    break;
                case Configuration.UI_MODE_NIGHT_NO:
                    window.setNavigationBarColor(0xffffffff);
                    // window.setNavigationBarDividerColor(0xffefefef);
                    flags |= View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
                    break;
            }
            decorView.setSystemUiVisibility(flags);
        }
    }

    /**
     * Returns the name of the main component registered from JavaScript. This is
     * used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "main";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        getReactInstanceManager().onConfigurationChanged(this, newConfig);
    }
}
