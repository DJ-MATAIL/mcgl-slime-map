import java.util.Random;
import java.util.Arrays;

class GetRandom {

	public static void main(String args[]) {
		long seed       = Long.parseLong(args[0]);
		int imageWidth  = Integer.parseInt(args[1]);
		int imageHeight = Integer.parseInt(args[2]);

		boolean[][] arr = new boolean[imageHeight / 16][imageWidth / 16];
		Random rnd = new Random();

		int oneLevelIterator = 0;
		int twoLevelIterator;

		for (int i = 0; i < imageWidth; i = i + 16) {
			twoLevelIterator = 0;

			for (int j = 0; j < imageHeight; j = j + 16) {
				int x = - (int) Math.floor((imageWidth / 2 - i) / 16);
				int y = - (int) Math.floor((j - imageHeight / 2) / 16);

				rnd.setSeed(
					seed +
					(long) (x * x * 0x4c1906) +
					(long) (x * 0x5ac0db) +
					(long) (y * y) * 0x4307a7L +
					(long) (y * 0x5f24f) ^ 0x3ad8025f
				);


				arr[oneLevelIterator][twoLevelIterator] = rnd.nextInt(10) == 0;
				twoLevelIterator++;
			}

			oneLevelIterator++;
		}

		StringBuilder json = new StringBuilder();

		json.append("[");

		for (int i = 0; i < arr.length; i++) {
			json.append(Arrays.toString(arr[i]));

			if (i != arr.length - 1) {
				json.append(",");
			}
		}

		json.append("]");

		System.out.print(json.toString());
	}

}