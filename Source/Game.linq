async Task Main()
{
    int canvasWidth = 500;
    int canvasHeight = 500;

    var canvas = new Canvas
    {
        Background = Brushes.Blue,
        Width = canvasWidth,
        Height = canvasHeight
    };

    PanelManager.StackWpfElement(canvas);
    var rand = new Random();
    var actors = new List<Actor>();
    var brushes = new List<Brush> { Brushes.Green, Brushes.Black, Brushes.Fuchsia };
    Func<Brush> randomBrush = () => brushes[rand.Next(brushes.Count)];

    var timer = new DispatcherTimer();
    timer.Interval = TimeSpan.FromMilliseconds(10);

    timer.Tick += (s, e) =>
    {
        actors.RemoveAll(actor => actor.Expired);
        actors.ForEach(actor => actor.Bounce(canvas, canvasHeight));
        actors.ForEach(actor => actor.Draw(canvas, canvasHeight));

        var lastActor = actors.LastOrDefault();

        if (actors.Count == 0 || actors.Last().Age > 5)
            actors.Add(new Actor(rand.Next(canvasWidth - 50), randomBrush()));
    };

    timer.Start();
    await Util.ReadLineAsync();
    timer.Stop();
}

// Define other methods and classes here
public class Actor
{
    public Actor(double x, Brush brush)
    {
        Brush = brush;
        Height = 50;
        Width = 50;
        X = x;
        RectTop = 0;

        StartTime = DateTime.Now;
        LastDrawTime = DateTime.Now;
        CurrentVelocity = 0;
        _displacement = 0;
    }

    public DateTime StartTime { get; set; }
    public double Age => (DateTime.Now - StartTime).TotalSeconds;
    public DateTime LastDrawTime { get; set; }
    public double DrawAge => (DateTime.Now - LastDrawTime).TotalSeconds * 1.8;
    public double Height { get; set; }
    public double Width { get; set; }
    public double X { get; set; }
    public double RectTop { get; set; }
    public double CurrentVelocity { get; set; }
    public Brush Brush { get; set; }
    public bool Stopped { get; set; }
    public bool Expired { get; set; }
    public DateTime StopTime { get; set; }
    public double StopAge => (DateTime.Now - StopTime).TotalSeconds;

    private void CalculateNewPosition()
    {
        if (Stopped) return;

        _displacement = Physics.GetDisplacement(CurrentVelocity, DrawAge, _gravity);
    }

    public void Draw(Canvas ctx, double ctxHeight)
    {
        if (_sprite == null)
        {
            //*
            var path = System.IO.Path.GetDirectoryName(Util.CurrentQueryPath);
            var filename = System.IO.Path.Combine(path, "RobotFullBody.xaml");
            var brush = new Random().Next(10) < 3 ? Brush : Brushes.Transparent;

            _sprite = new Viewbox
            {
                Height = Height,
                Width = Width,
                RenderTransformOrigin = new Point(0.5, 0.5),
                Child = new Frame { Source = new Uri(filename), Background = brush }
            };
            /*/
            _sprite = new Rectangle
            {
                Height = Height,
                Width = Width,
                Fill = Brush,
                RenderTransformOrigin = new Point(0.5, 0.5),
                RenderTransform = new RotateTransform(45),
                Opacity = 1
            };
            //*/
            
            ctx.Children.Add(_sprite);
        }

        if (Stopped)
        {
            _sprite.Opacity = 1 - StopAge;
            Expired = StopAge >= 1;
            
            if (Expired)
                ctx.Children.Remove(_sprite);

            return;
        }

        //_sprite.Opacity = 1 - (Age % 0.4);
        var degrees = (DrawAge * 90) % 360;
        _sprite.RenderTransform = new RotateTransform(degrees);
        CalculateNewPosition();
        double y = RectTop + _displacement;
        //y = Math.Min(y, ctxHeight - Height); // Hack to solve the sinking.
        _sprite.SetCanvasPosition(X, y);
    }

    public void Stop(double groundDistance)
    {
        CurrentVelocity = 0;
        _displacement = 0;
        RectTop = groundDistance - Height;
        Stopped = true;
        StopTime = DateTime.Now;
    }

    public void Bounce(Canvas ctx, double groundDistance)
    {
        var currentVelocity = Physics
            .GetFinalVelocity(CurrentVelocity, DrawAge, _gravity) * 0.7;

        var rectBottom = RectTop + Height;
        
        if (rectBottom > groundDistance - 5 && currentVelocity < 0
            && Math.Abs(currentVelocity) < 0.0005)
            {
                Stop(groundDistance);
                return;
            }

        if (rectBottom + _displacement > groundDistance && currentVelocity > 0)
        {
            CalculateNewPosition();
            CurrentVelocity = -currentVelocity;
            LastDrawTime = DateTime.Now;
            RectTop += _displacement;
        }
    }
    
    private UIElement _sprite;
    private double _displacement;
    private double _gravity = 46;
    //private double _gravity = 9.80665;
}

public static class Physics
{
    public static double GetDisplacement(double initialVelocity, double time, double acceleration)
        => initialVelocity * time + acceleration * time * time / 2;

    public static double GetFinalVelocity(double initialVelocity, double time, double acceleration)
        => initialVelocity + acceleration * time;
}

public static class MyExtensions
{
    public static void SetCanvasPosition(this UIElement e, double x, double y)
    {
        e.SetValue(Canvas.LeftProperty, x);
        e.SetValue(Canvas.TopProperty, y);
    }
}
