type AuthCallback = Function;
type ClassPath = string;
type JavaLand<x> = Partial<x>;
type JavaImport = { [k: string]: any };

declare function JavaImporter(...importLines: Array<string>): JavaImport;

// Java stdlib - dont bother trying to typedef in full, its so big it will slow down TS, trust me I tried!
// maybe do a commonly used definition some day
declare const org: JavaLand<{
  forgerock: Partial<{
    openam: Partial<{
      auth: {
        node: {
          api: {
            AbstractDecisionNode: {
              OutcomeProvider: ClassPath;
            };
            AbstractNodeAmPlugin: ClassPath;
            Action: ClassPath;
            ActionBuilder: ClassPath;
            ExternalRequestContext: {
              Builder: ClassPath;
            };
            NodeState: ClassPath;
            OutcomeProvider: {
              Outcome: ClassPath;
            };
            SharedStateConstants: ClassPath;
            SingleOutcomeNode: {
              OutcomeProvider: ClassPath;
            };
            TextOutputCallback: ClassPath;
            SuspendedTextOutputCallback: ClassPath;
            Throwable: ClassPath;
            Exception: ClassPath;
            NodeProcessException: ClassPath;
            TreeContext: ClassPath;
          };
        };
      };
    }>;
  }>;
}>;
declare const com: JavaLand<{
  sun: Partial<{
    identity: Partial<{
      authentication: Partial<{
        callbacks: Partial<{
          BooleanAttributeInputCallback: ClassPath;
          ChoiceCallback: ClassPath;
          ConfirmationCallback: ClassPath;
          ConsentMappingCallback: ClassPath;
          DeviceProfileCallback: ClassPath;
          HiddenValueCallback: ClassPath;
          HttpCallback: ClassPath;
          IdPCallback: ClassPath;
          KbaCreateCallback: ClassPath;
          LanguageCallback: ClassPath;
          MetadataCallback: ClassPath;
          NameCallback: ClassPath;
          NumberAttributeInputCallback: ClassPath;
          PasswordCallback: ClassPath;
          PollingWaitCallback: ClassPath;
          RedirectCallback: ClassPath;
          ScriptTextOutputCallback: ClassPath;
          SelectIdPCallback: ClassPath;
          StringAttributeInputCallback: ClassPath;
          SuspendedTextOutputCallback: ClassPath;
          TermsAndConditionsCallback: ClassPath;
          TextInputCallback: ClassPath;
          TextOutputCallback: ClassPath;
          ValidatedCreatePasswordCallback: ClassPath;
          ValidatedCreateUsernameCallback: ClassPath;
          X509CertificateCallback: ClassPath;
        }>;
      }>;
    }>;
  }>;
}>;

declare const logger: JavaLand<{
  message(str: string): void;
  error(str: string): void;
}>;
/**
 * Interact with the callbacks API
 * */
declare const callbacks: {
  /**
   * Are there any callbacks?
   */
  isEmpty(): boolean;
};

/**
 * Declare an action for this Auth node
 * */
declare var action: any;

declare var global: any;
