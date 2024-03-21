const fetchUserProfile = require("./fetchUserProfile");

const defaultContext = {};

describe("fetchUserProfile", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("request.get options", () => {
    beforeEach(() => {
      global.request = { get: jest.fn() };
      fetchUserProfile("__test_access_token__", defaultContext, jest.fn());
    });

    it("should call request.get", () => {
      expect(global.request.get).toHaveBeenCalledTimes(1);
    });

    it("should get the correct endpoint", () => {
      expect(global.request.get.mock.calls[0][0].url).toEqual("USERINFO_URL");
    });

    it("should use the passed-in access token", () => {
      expect(global.request.get.mock.calls[0][0].headers).toMatchObject({
        Authorization: "Bearer __test_access_token__",
      });
    });
  });

  describe("request.get callback", () => {
    afterEach(() => {
      global.request = {};
    });

    const profileCallback = jest.fn();

    it("should call the callback with an error", () => {
      const requestError = new Error("__test_error__");
      global.request = { get: jest.fn((opts, cb) => cb(requestError)) };
      fetchUserProfile(1, defaultContext, profileCallback);

      expect(profileCallback.mock.calls).toHaveLength(1);
      expect(profileCallback.mock.calls[0][0]).toEqual(requestError);
    });

    it("should call the callback with an error if request is not successful", () => {
      global.request = {
        get: jest.fn((opts, cb) => {
          cb(null, { statusCode: 401 });
        }),
      };
      fetchUserProfile(1, defaultContext, profileCallback);

      expect(profileCallback).toBeCalledWith(
        new Error(
          "Failed status code check for user profile response. Received 401."
        )
      );
    });

    it("should handle invalid JSON responses", () => {
      global.request = {
        get: jest.fn((opts, cb) => {
          cb(null, { statusCode: 200 }, "__test_invalid_json__");
        }),
      };
      fetchUserProfile(1, defaultContext, profileCallback);

      expect(profileCallback.mock.calls).toHaveLength(1);
      expect(profileCallback.mock.calls[0][0]).toEqual(
        new Error("Failed JSON parsing for user profile response.")
      );
    });

    it("should call the callback with the profile if response is ok", () => {
      const responseBody = {
        sub: "61d2f90c3c2083e1c08af22d",
        name: "Coyotte508",
        preferred_username: "coyotte508",
        profile: "https://huggingface.co/coyotte508",
        picture:
          "https://aeiljuispo.cloudimg.io/v7/https://cdn-uploads.huggingface.co/production/uploads/1653578803493-61d2f90c3c2083e1c08af22d.png?w=200&h=200&f=face",
        website: "https://www.coyo.dev",
        email: "coyotte508@users.noreply.huggingface.co",
        email_verified: true,
        isPro: false,
        canPay: true,
        orgs: [
          {
            sub: "5e67bd5b1009063689407478",
            preferred_username: "huggingface",
            isEnterprise: true,
          },
          {
            sub: "6414d83b385a75d7790d5a58",
            preferred_username: "huggingfacejs",
            isEnterprise: false,
          }
        ],
      };

      global.request = {
        get: jest.fn((opts, cb) => {
          cb(null, { statusCode: 200 }, JSON.stringify(responseBody));
        }),
      };

      fetchUserProfile(1, defaultContext, profileCallback);

      expect(profileCallback.mock.calls).toHaveLength(1);
      expect(profileCallback.mock.calls[0][0]).toBeNull();
      expect(profileCallback.mock.calls[0][1]).toEqual({
        user_id: "61d2f90c3c2083e1c08af22d",
        fullname: "Coyotte508",
        username: "coyotte508",
        profile: "https://huggingface.co/coyotte508",
        picture:
          "https://aeiljuispo.cloudimg.io/v7/https://cdn-uploads.huggingface.co/production/uploads/1653578803493-61d2f90c3c2083e1c08af22d.png?w=200&h=200&f=face",
        website: "https://www.coyo.dev",
        email: "coyotte508@users.noreply.huggingface.co",
        email_verified: true,
        is_pro: false,
        can_pay: true,
        organizations: [
          {
            id: "5e67bd5b1009063689407478",
            username: "huggingface",
            is_enterprise: true,
          },
          {
            id: "6414d83b385a75d7790d5a58",
            username: "huggingfacejs",
            is_enterprise: false,
          }
        ],
      });
    });
  });
});
