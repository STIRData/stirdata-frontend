export default async function ({ $auth }) {
  if (!$auth) {
    return
  }

  if($auth.strategy.name === 'google'){
    let token = $auth.strategy.token.get();
    if(token){token=token.substr(7);}
    else return;
    const url = '/oauth/authorize/google';
    const userUrl='/user/me';
    
    try {
       $auth.ctx.$api.$post(url, { token: token }).then((response) => {
                
        if(!response){return;}
          $auth.ctx.$api.setToken(response.token, 'Bearer');
      
          setTimeout(async() => {
                //$auth.setStrategy('local');
                $auth.strategy.token.set('Bearer '+ response.token);
                setTimeout(async() => {
                      const user = await $auth.ctx.$api.$get(userUrl);
                     
                      $auth.setUser(user);
                })
                $auth.ctx.redirect(302, '/');
                return;
          })
    })
      
    } catch (e) {
      console.log(e);
    }
  }
}
