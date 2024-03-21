/* globals request */
module.exports = function fetchUserProfile(accessToken, context, callback) {
  request.get(
    {
      url: "USERINFO_URL",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    (error, response, body) => {
      if (error) {
        return callback(error);
      }

      if (response.statusCode >= 300) {
        return callback(new Error(`Failed status code check for user profile response. Received ${response.statusCode}.`));
      }

      let bodyParsed;
      try {
        bodyParsed = JSON.parse(body);
      } catch (jsonError) {
        return callback(new Error(`Failed JSON parsing for user profile response.`));
      }

      const profile = {
        user_id: bodyParsed.sub,
        email: bodyParsed.email,
        email_verified: bodyParsed.email_verified,
        fullname: bodyParsed.name,
        username: bodyParsed.preferred_username,
				profile: bodyParsed.profile,
				picture: bodyParsed.picture,
				website: bodyParsed.website,

        is_pro: bodyParsed.isPro,
        can_pay: bodyParsed.canPay,
        organizations: (bodyParsed.orgs || []).map(org => ({
          id: org.sub,
          username: org.preferred_username,
          is_enterprise: org.isEnterprise,
          can_pay: org.canPay,
        })), 
      };

      for (const key in profile) {
        if (profile[key] === undefined) {
          delete profile[key];
        }
      }

      for (const org of profile.organizations) {
        for (const key in org) {
          if (org[key] === undefined) {
            delete org[key];
          }
        }
      }

      return callback(null, profile);
    }
  );
};
