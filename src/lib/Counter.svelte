<script>
  export let initCount= 0
  export let maxCount= 10

  let name = 'svelte'
  let stingInterop = name.toLocaleLowerCase() + '<br>  string interop with <br> <q><b><i>html</i></b></q>'
  let count = initCount
  
  /**
   * rhs var updates on lfh update
   * usecase: 
   */
  $: countUpdate = 'counter update ' + count

  console.log($$props, $$restProps)
  let props = $$props
  let restProps = $$restProps
  
  const increment = () => {
    if(count < maxCount) {
      count++
    }
  }
</script>

{@html stingInterop}

<br>
<br>

<button on:click={increment}>
  count is {count}
</button>

<p>{countUpdate}</p>


<h6>$$</h6>
<hr>
props {props.initCount} 
<hr>
restProps {restProps.x}
<hr>


<!-- for app.svelte -->
<h1> {name.toLocaleLowerCase()}</h1>
<br>
  <br>
  <!-- <Counter initCount={0} maxCount={10}/> -->
  <!-- <Counter {...props} x={5} /> -->
  <br>
  <br>
  <br>
