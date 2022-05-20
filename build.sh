# turbocaret****deploy_

if node genConfig && nest build; then
  
  if yarn migrate:generate; then
     
     echo yarn migrate:generate
     echo yarn migrate:run

  fi

fi