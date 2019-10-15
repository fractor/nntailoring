#include <stdio.h>
#include <math.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

typedef struct {
  double x, y;
  int label;
} Example2D;


typedef struct
{
	double x,y;
} vec2;

double dist(vec2 a, vec2 b) {
	double dx = a.x - b.x;
	double dy = a.y - b.y;
	return sqrt(dx * dx + dy * dy);
}

double dSNR(double x) {
	return 1.0/pow(10.0,x/10.0);
}

double randUniform(double a, double b) {
  return (rand() % RAND_MAX / (double) RAND_MAX) * (b - a) + a;
}

double normalRandom(double mean, double variance) 
{
	double v1, v2, s, rv1=0.0, rv2=0.0;
	do
	{
		rv1 = rand() % RAND_MAX / (double) RAND_MAX;
		rv2 = rand() % RAND_MAX / (double) RAND_MAX;
		v1 = 2.0 * rv1 - 1.0;
		v2 = 2.0 * rv2 - 1.0;
		s = v1 * v1 + v2 * v2;
	} while (s > 1.0) ;

	double result = sqrt(-2 * log(s) / s) * v1;
	return mean + sqrt(variance) * result;
}

void classifyXORData(int numSamples, double noise, Example2D* points)
{
	// AWG Noise Variance = Signal / 10^(SNRdB/10)
	double dNoise = dSNR(noise);
  
	// Standard deviation of the signal
	double stdSignal = 5.0;
  
	for (int i = 0; i < numSamples; i++) 
	{
		double x = randUniform(-stdSignal, stdSignal);
		double padding = -0.3;
		if (x += x > 0) padding = -padding;  // Padding.
		double y = randUniform(-stdSignal, stdSignal);
		if (y += y > 0) padding = -padding;
    
		double varianceSignal = stdSignal*stdSignal;
		double noiseX = normalRandom(0, varianceSignal*dNoise);
		double noiseY = normalRandom(0, varianceSignal*dNoise);
		int label = -1;
		if (x * y > 0) label = 1;
		points[i].x = x;
		points[i].y = y;
		points[i].label = label;
	}
}

void classifyTwoGaussData(int numSamples, double noise, Example2D* points) 
{
	double cx = 2.0, cy = 2.0;
	double variance = 0.5;

  // AWG Noise Variance = Signal / 10^(SNRdB/10)
	double dNoise = dSNR(noise);

	int label = 1;
    for (int i = 0; i < numSamples/2; i++) 
    {
		double noiseX = normalRandom(0, variance*dNoise);
		double noiseY = normalRandom(0, variance*dNoise);
		double signalX = normalRandom(cx, variance);
		double signalY = normalRandom(cy, variance);
		double x = signalX + noiseX;
		double y = signalY + noiseY;
        
		points[i].x = x;
		points[i].y = y;
		points[i].label = label;
    }
    cx = -cx;
	cy = -cy;
	label = -label;
	for (int i = numSamples/2; i < numSamples; i++) 
    {
		double noiseX = normalRandom(0, variance*dNoise);
		double noiseY = normalRandom(0, variance*dNoise);
		double signalX = normalRandom(cx, variance);
		double signalY = normalRandom(cy, variance);
		double x = signalX + noiseX;
		double y = signalY + noiseY;
        
		points[i].x = x;
		points[i].y = y;
		points[i].label = label;
    }
}

void classifyCircleData(int numSamples, double noise, Example2D* points)
{
	// AWG Noise Variance = Signal / 10^(SNRdB/10)
	double dNoise = dSNR(noise);
  
	double radius = 5.0;

	// Generate positive points inside the circle.
	for (int i = 0; i < numSamples / 2; i++) 
	{
		double r = randUniform(0, radius * 0.5);
        // We assume r^2 as the variance of the Signal
		double r2 = r*r;
		double angle = randUniform(0, 2 * M_PI);
		double x = r * sin(angle);
		double y = r * cos(angle);
		double noiseX = normalRandom(0, 1/radius*dNoise);
		double noiseY = normalRandom(0, 1/radius*dNoise);
		x += noiseX;
		y += noiseY;
		int label = 1;
		points[i].x = x;
		points[i].y = y;
		points[i].label = label;
	}

	// Generate negative points outside the circle.
	for (int i = numSamples/2; i < numSamples; i++) 
	{
		double r = randUniform(radius * 0.7, radius);
    
		// We assume r^2 as the variance of the Signal
		double rr2 = r*r;
		double angle = randUniform(0, 2 * M_PI);
		double x = r * sin(angle);
		double y = r * cos(angle);
		double noiseX = normalRandom(0, 1/radius*dNoise);
		double noiseY = normalRandom(0, 1/radius*dNoise);
		x += noiseX;
		y += noiseY;
		int label = -1;
		points[i].x = x;
		points[i].y = y;
		points[i].label = label;
	}
}

void classifySpiralData(int numSamples, double noise, Example2D* points)
{
	// AWG Noise Variance = Signal / 10^(SNRdB/10)
	double dNoise = dSNR(noise);
	
	int n = numSamples / 2;
	
	double deltaT = 0.0;
	int label = 1;
    for (int i = 0; i < numSamples/2; i++) 
    {
		double r = (double) i / (double) n * 5.0;
		double r2 = r*r;
		double t = 1.75 * (double) i / (double) n * 2.0 * M_PI + deltaT;
		double noiseX = normalRandom(0, r*dNoise);
		double noiseY = normalRandom(0, r*dNoise);
		double x = r * sin(t) + noiseX;
		double y = r * cos(t) + noiseY;
		points[i].x = x;
		points[i].y = y;
		points[i].label = label;
    }
    
    deltaT = M_PI;
    label = -label;
    for (int i = 0; i < numSamples/2; i++) 
    {
		double r = (double) i / (double) n * 5.0;
		double r2 = r*r;
		double t = 1.75 * (double) i / (double) n * 2.0 * M_PI + deltaT;
		double noiseX = normalRandom(0.0, r*dNoise);
		double noiseY = normalRandom(0.0, r*dNoise);
		double x = r * sin(t) + noiseX;
		double y = r * cos(t) + noiseY;
		points[i+n].x = x;
		points[i+n].y = y;
		points[i+n].label = label;
    }
}

void helpMsg(char* fname)
{
	printf("Usage: %s [numSamples] [SNR_dB] [out_filename] [option]\n", fname);
	printf("Options:\n");
	printf("1 - Two Gaussian\n");
	printf("2 - XOR\n");
	printf("3 - Circle\n");
	printf("4 - Spiral\n");
	
}

int main(int argc, char **argv)
{
	srand(time(0));
	if (argc < 4) {
		 helpMsg(argv[0]);
		 exit(-1);
	} 
	int numSamples = atoi(argv[1]);
	double noise = atof(argv[2]);
	FILE *fp = fopen(argv[3], "w");
	int choice = atoi(argv[4]);
	
	Example2D* points = (Example2D*) calloc(numSamples, sizeof(Example2D));
	
	switch (choice)
	{
		case 1:
			classifyTwoGaussData(numSamples, noise, points);
			break;
		case 2:
			classifyXORData(numSamples, noise, points);
			break;
		case 3:
			classifyCircleData(numSamples, noise, points);
			break;
		case 4:
			classifySpiralData(numSamples, noise, points);
			break;
		default:
			helpMsg(argv[0]);
			exit(-1);
	}
	
	// write the points to file
	for (int i = 0; i < numSamples; i++)
	{
		//printf("%15.10f\t%15.10f\t%15.10f\n", points[i].x, points[i].y, points[i].label);
		fprintf(fp, "%15.10f,%15.10f,%d\n", points[i].x, points[i].y, points[i].label);
	}
	fclose(fp);
	free(points);
	return 0;
}
