#import <Foundation/Foundation.h>
#import <React/RCTBridgeDelegate.h>
#import <UMReactNativeAdapter/UMModuleRegistryAdapter.h>
#import <UIKit/UIKit.h>
#import <UserNotifications/UNUserNotificationCenter.h>

#import <UMCore/UMAppDelegateWrapper.h>

@interface AppDelegate : UMAppDelegateWrapper <RCTBridgeDelegate, UNUserNotificationCenterDelegate>

@property (nonatomic, strong) UMModuleRegistryAdapter *moduleRegistryAdapter;
@property (nonatomic, strong) UIWindow *window;

@end
